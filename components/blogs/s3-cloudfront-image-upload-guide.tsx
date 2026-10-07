"use client";
import { useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";
import Link from "next/link";

/* ───────────────────────── Types ───────────────────────── */
type Block =
  | { t: "p"; v: string }
  | { t: "h"; v: string }
  | { t: "ul" | "ol"; v: string[] }
  | { t: "code"; v: string; lang?: string }
  | { t: "note"; v: string; kind?: "note" | "warn" | "tip" }
  | {
      t: "tabs";
      id: string;
      def?: string;
      tabs: { id: string; label: string; body: Block[] }[];
    };

type Step = { title: string; body: Block[] };

/* ───────────────────────── Content ───────────────────────── */
const META = {
  title:
    "How to Upload Images to Amazon S3 and Serve Them with CloudFront Signed URLs in Node.js",
  desc: "A step-by-step guide to uploading, deleting and securely delivering images with Amazon S3, CloudFront signed URLs, Multer and Sharp in a Node.js and Express backend.",
  date: "Oct 07, 2026",
  read: "15 min read",
  tags: ["AWS", "S3", "CloudFront", "Node.js"],
  stack: [
    "Amazon S3",
    "CloudFront",
    "IAM",
    "Signed URLs",
    "Node.js",
    "Multer",
    "Sharp",
  ],
};

const STEPS: Step[] = [
  {
    title: "What we're building",
    body: [
      {
        t: "p",
        v: "In this guide you will store images in a private Amazon S3 bucket and deliver them through the CloudFront CDN. The bucket is never exposed publicly. Users receive short-lived signed URLs instead.",
      },
      {
        t: "ul",
        v: [
          "`PutObject` uploads an image to S3.",
          "`DeleteObject` removes an image from S3.",
          "CloudFront serves images from edge locations close to the user, which improves delivery speed.",
          "Signed URLs grant temporary access and let you control how long each link stays valid.",
        ],
      },
      {
        t: "code",
        v: "  Upload                         Delivery\n  ──────                         ────────\n  Client → Express API           Client → CloudFront (signed URL)\n            │                                │\n            ▼                                ▼\n   multer → sharp (WebP)           Edge cache (HIT / MISS)\n            │                                │\n            ▼                                ▼\n   S3 PutObject  ───────────────►  Private S3 bucket (via OAC)",
        lang: "architecture",
      },
      {
        t: "note",
        v: "Use an IAM user for everything below, not the AWS root account.",
        kind: "warn",
      },
    ],
  },
  {
    title: "Prerequisites and packages",
    body: [
      {
        t: "p",
        v: "You need an AWS account, Node.js 18+, and an Express project. Install the dependencies:",
      },
      {
        t: "code",
        v: "npm install @aws-sdk/client-s3 @aws-sdk/cloudfront-signer multer sharp",
      },
      {
        t: "p",
        v: "By the end you will have these environment variables. The next steps show where each value comes from:",
      },
      {
        t: "code",
        v: 'AWS_REGION="ap-south-2"\nAWS_BUCKET_NAME="my-project-images"\nAWS_ACCESS_KEY_ID="AKIAXXXXXXXXXXXX"\nAWS_SECRET_ACCESS_KEY="xxxxxxxxxxxxxxxxxxxxxxxx"\nCLOUDFRONT_DOMAIN="https://xxxxxxxx.cloudfront.net"\nAWS_CLOUDFRONT_KEY_PAIR_ID="E123456789ABCDE"\nCLOUDFRONT_PRIVATE_KEY_PATH="./keys/private_key.pem"',
        lang: ".env",
      },
    ],
  },
  {
    title: "Choose a region and create the S3 bucket",
    body: [
      {
        t: "p",
        v: "Pick the AWS region closest to your users or servers. For example, Asia Pacific (Hyderabad) is `ap-south-2`, which becomes `AWS_REGION`.",
      },
      {
        t: "p",
        v: "Open `AWS Console → S3 → General purpose buckets → Create bucket`, then:",
      },
      {
        t: "ol",
        v: [
          "Enter a globally unique bucket name, for example `my-project-images`.",
          "Keep **Block all public access** enabled. CloudFront will read the bucket, not the public.",
          "Click `Create bucket`.",
        ],
      },
      {
        t: "p",
        v: "The bucket name becomes `AWS_BUCKET_NAME`.",
      },
    ],
  },
  {
    title: "Create IAM credentials",
    body: [
      {
        t: "p",
        v: "Your backend needs AWS credentials to upload and delete objects. Choose the option that matches your setup.",
      },
      {
        t: "tabs",
        id: "iam",
        def: "new",
        tabs: [
          {
            id: "new",
            label: "Create a new IAM user",
            body: [
              {
                t: "p",
                v: "A dedicated user limits the damage if a key ever leaks. Go to `IAM → Users → Create user` and name it, for example, `my-project-s3-user`.",
              },
              {
                t: "p",
                v: "Attach an inline policy that grants only what the app needs, scoped to your bucket:",
              },
              {
                t: "code",
                v: '{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Effect": "Allow",\n      "Action": ["s3:PutObject", "s3:DeleteObject"],\n      "Resource": "arn:aws:s3:::my-project-images/*"\n    }\n  ]\n}',
                lang: "json",
              },
              {
                t: "note",
                v: "Add `s3:GetObject` only if your backend must read objects directly from S3. CloudFront reads through its own access rule.",
                kind: "tip",
              },
            ],
          },
          {
            id: "existing",
            label: "Use an existing IAM user",
            body: [
              {
                t: "p",
                v: "If you are already using an IAM user, for example `developer`, you can reuse that user. Make sure the IAM user has access to the S3 bucket, either with the required permissions such as `s3:PutObject` and `s3:DeleteObject`, or with full S3 access if that is how your development environment is configured.",
              },
              {
                t: "note",
                v: "Prefer a dedicated user for production so permissions stay minimal.",
                kind: "tip",
              },
            ],
          },
        ],
      },
      {
        t: "h",
        v: "Create the access key",
      },
      {
        t: "p",
        v: "Open `IAM → Users → your user → Security credentials → Create access key`. AWS shows the Access key ID and Secret access key. Add both to `.env`.",
      },
      {
        t: "note",
        v: "Copy the secret access key immediately. AWS shows it only once. If you lose it, you must create a new key.",
        kind: "warn",
      },
      {
        t: "note",
        v: "Never commit the secret to GitHub, hard-code it, or expose it in frontend JavaScript. Use environment variables or a secrets manager. On EC2, an IAM role is even better than long-lived keys.",
        kind: "warn",
      },
    ],
  },
  {
    title: "Create the CloudFront distribution",
    body: [
      {
        t: "p",
        v: "Go to `CloudFront → Distributions → Create distribution` and configure:",
      },
      {
        t: "ol",
        v: [
          "Choose a plan, for example **Pay as you go**.",
          "Give it a name such as `project-images-cdn`.",
          "Set the origin type to **Amazon S3** and click Browse S3 to select your bucket.",
          "Enable **Allow private S3 bucket access to CloudFront (Recommended)**. This uses Origin Access Control (OAC).",
          "Keep the remaining defaults and create the distribution.",
        ],
      },
      {
        t: "p",
        v: "Copy the **Distribution domain name**, for example `https://xxxxxxxx.cloudfront.net`. It becomes `CLOUDFRONT_DOMAIN`.",
      },
      {
        t: "note",
        v: "If CloudFront asks to update the bucket policy, accept it. This policy is what lets CloudFront read your private bucket. Without it you will get 403 errors.",
        kind: "tip",
      },
    ],
  },
  {
    title: "Generate the public and private keys",
    body: [
      {
        t: "p",
        v: "Signed URLs use an RSA key pair. Your backend signs URLs with the private key and CloudFront verifies them with the public key. In Git Bash or any terminal:",
      },
      {
        t: "code",
        v: "mkdir keys\n\n# Generate the private key\nopenssl genrsa -out keys/private_key.pem 2048\n\n# Derive the public key from it\nopenssl rsa -pubout -in keys/private_key.pem -out keys/public_key.pem",
      },
      {
        t: "p",
        v: "Keep `private_key.pem` on your server only. You will upload `public_key.pem` to AWS in the next step.",
      },
      {
        t: "code",
        v: "# .gitignore\nkeys/\n*.pem",
        lang: ".gitignore",
      },
      {
        t: "note",
        v: "Never commit the private key. Anyone who has it can generate valid URLs for your content.",
        kind: "warn",
      },
    ],
  },
  {
    title: "Add the public key and create a key group",
    body: [
      {
        t: "h",
        v: "Upload the public key",
      },
      {
        t: "p",
        v: "Go to `CloudFront → Public keys → Create public key`. Name it `my-project-cloudfront-key`, paste the contents of `public_key.pem`, and create it. CloudFront returns a **Public key ID**, for example `E123456789ABCDE`. This is your `AWS_CLOUDFRONT_KEY_PAIR_ID`.",
      },
      {
        t: "h",
        v: "Create the key group",
      },
      {
        t: "p",
        v: "Go to `CloudFront → Key groups → Create key group`, name it `my-project-key-group`, and add the public key.",
      },
      {
        t: "code",
        v: "Private key  →  Backend (signs URLs)\nPublic key   →  CloudFront (verifies URLs)\nKey group    →  Distribution behavior (who may sign)",
        lang: "how it fits",
      },
    ],
  },
  {
    title: "Require signed URLs on the distribution",
    body: [
      {
        t: "p",
        v: "Creating a key group does nothing until the distribution requires it.",
      },
      {
        t: "ol",
        v: [
          "Open your distribution and go to the **Behaviors** tab.",
          "Select the default behavior and click `Edit`.",
          "Under **Restrict viewer access**, choose **Yes**.",
          "Set trusted authorization type to **Trusted key groups** and select `my-project-key-group`.",
          "Save changes and wait for the distribution to finish deploying.",
        ],
      },
      {
        t: "note",
        v: "Now a plain CloudFront URL returns 403 Forbidden. Only URLs signed by your backend work.",
        kind: "tip",
      },
    ],
  },
  {
    title: "The S3 utility module",
    body: [
      {
        t: "p",
        v: "Create `utils/s3_bucket/index.js`. It handles unique file names, uploads, deletes and signed URL generation.",
      },
      {
        t: "code",
        v: 'const {\n  S3Client,\n  PutObjectCommand,\n  DeleteObjectCommand,\n} = require("@aws-sdk/client-s3");\nconst { getSignedUrl } = require("@aws-sdk/cloudfront-signer");\nconst fs = require("fs");\nconst path = require("path");\nconst crypto = require("crypto");\n\nconst {\n  AWS_REGION,\n  AWS_BUCKET_NAME,\n  AWS_ACCESS_KEY_ID,\n  AWS_SECRET_ACCESS_KEY,\n  AWS_CLOUDFRONT_KEY_PAIR_ID,\n  CLOUDFRONT_DOMAIN,\n  CLOUDFRONT_PRIVATE_KEY_PATH,\n} = process.env;\n\nconst s3 = new S3Client({\n  region: AWS_REGION,\n  credentials: {\n    accessKeyId: AWS_ACCESS_KEY_ID,\n    secretAccessKey: AWS_SECRET_ACCESS_KEY,\n  },\n});\n\n// Read the private key once at startup, not on every request\nconst privateKey = fs.readFileSync(\n  path.resolve(CLOUDFRONT_PRIVATE_KEY_PATH),\n  "utf8"\n);\n\nconst generateUniqueFileName = (userId, originalFileName) => {\n  const extension = path.extname(originalFileName || "").toLowerCase();\n  const now = Date.now();\n  const hash = crypto\n    .createHash("sha256")\n    .update(`${userId}-${now}-${crypto.randomUUID()}`)\n    .digest("hex")\n    .substring(0, 16);\n\n  return `${userId}_${now}_${hash}${extension}`;\n};\n\nconst uploadToS3 = async (file, folder, fileName, mimetype = "image/webp") => {\n  const key = `${folder}/${fileName}`;\n\n  await s3.send(\n    new PutObjectCommand({\n      Bucket: AWS_BUCKET_NAME,\n      Key: key,\n      Body: file,\n      ContentType: mimetype,\n      ContentDisposition: "inline",\n      CacheControl: "public, max-age=31536000, immutable",\n    })\n  );\n\n  return key; // store this key in the database\n};\n\nconst deleteFile = async (fileKey) =>\n  s3.send(\n    new DeleteObjectCommand({\n      Bucket: AWS_BUCKET_NAME,\n      Key: fileKey,\n    })\n  );\n\n// Returns a temporary signed CloudFront URL\nconst getImageUrl = (fileKey, validForHours = 24) => {\n  if (!fileKey) return null;\n\n  return getSignedUrl({\n    url: `${CLOUDFRONT_DOMAIN}/${fileKey}`,\n    keyPairId: AWS_CLOUDFRONT_KEY_PAIR_ID,\n    privateKey,\n    dateLessThan: new Date(Date.now() + validForHours * 60 * 60 * 1000),\n  });\n};\n\nmodule.exports = { uploadToS3, deleteFile, getImageUrl, generateUniqueFileName };',
        lang: "utils/s3_bucket/index.js",
      },
      {
        t: "note",
        v: "S3 stores the file key, such as `profile/12_1760000000000_ab12cd34.webp`. Store the key in your database, never the signed URL. Signed URLs expire and are generated on demand.",
        kind: "tip",
      },
    ],
  },
  {
    title: "Define S3 folders",
    body: [
      {
        t: "p",
        v: "Folder constants keep keys consistent across your codebase:",
      },
      {
        t: "code",
        v: 'const S3_FOLDERS = {\n  PROFILE: "profile",\n  POST: "post",\n};\n\nmodule.exports = S3_FOLDERS;',
        lang: "constants/s3BucketFolders.js",
      },
    ],
  },
  {
    title: "Upload middleware with Multer",
    body: [
      {
        t: "p",
        v: "Multer parses `multipart/form-data`. Memory storage keeps the file in a buffer so we can process it before sending it to S3. This middleware accepts JPEG, PNG, WEBP and PDF files up to 5 MB.",
      },
      {
        t: "code",
        v: 'const multer = require("multer");\n\nconst ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];\n\nconst fileFilter = (req, file, cb) => {\n  if (ALLOWED.includes(file.mimetype)) return cb(null, true);\n  cb(new Error("Only JPEG, PNG, WEBP images or PDF files are allowed"), false);\n};\n\nmodule.exports = multer({\n  storage: multer.memoryStorage(),\n  fileFilter,\n  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB\n});',
        lang: "middleware/upload.js",
      },
    ],
  },
  {
    title: "Optimize images with Sharp",
    body: [
      {
        t: "p",
        v: "Sharp converts every uploaded image to WebP at 80% quality, which usually cuts file size substantially. PDFs pass through unchanged. The middleware supports `upload.single()`, `upload.array()` and `upload.fields()`.",
      },
      {
        t: "code",
        v: 'const sharp = require("sharp");\nconst path = require("path");\n\nconst IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];\nconst randomName = () => `${Date.now()}-${Math.round(Math.random() * 1e9)}`;\n\nconst collectFiles = (req) => {\n  if (req.file) return [req.file]; // upload.single()\n  if (Array.isArray(req.files)) return req.files; // upload.array()\n  if (req.files && typeof req.files === "object") {\n    return Object.values(req.files).flat(); // upload.fields()\n  }\n  return [];\n};\n\nconst processImages = async (req, res, next) => {\n  try {\n    const files = collectFiles(req);\n    if (!files.length) return next();\n\n    req.processedImages = await Promise.all(\n      files.map(async (file) => {\n        if (IMAGE_TYPES.includes(file.mimetype)) {\n          const buffer = await sharp(file.buffer)\n            .rotate() // respect EXIF orientation\n            .webp({ quality: 80 })\n            .toBuffer();\n\n          return {\n            fieldname: file.fieldname,\n            filename: `${randomName()}.webp`,\n            file: buffer,\n            mimetype: "image/webp",\n          };\n        }\n\n        // PDFs and other allowed non-image files pass through untouched\n        return {\n          fieldname: file.fieldname,\n          filename: `${randomName()}${path.extname(file.originalname)}`,\n          file: file.buffer,\n          mimetype: file.mimetype,\n        };\n      })\n    );\n\n    next();\n  } catch (error) {\n    next(error);\n  }\n};\n\nmodule.exports = processImages;',
        lang: "middleware/processImages.js",
      },
    ],
  },
  {
    title: "Routes and controller (user profile image)",
    body: [
      {
        t: "p",
        v: "As an example, assume your `User` model has a string column `profileImage`. The frontend sends `multipart/form-data` with the field `image`.",
      },
      {
        t: "code",
        v: 'const express = require("express");\nconst router = express.Router();\n\nconst upload = require("../middleware/upload");\nconst processImages = require("../middleware/processImages");\nconst { uploadProfileImage, getUser } = require("../controllers/userController");\n\n// Frontend sends multipart/form-data with the field name "image"\nrouter.put("/profile-image", upload.single("image"), processImages, uploadProfileImage);\nrouter.get("/:id", getUser);\n\n// For multiple files use: upload.array("images", 10)\n\nmodule.exports = router;',
        lang: "routes/userRoutes.js",
      },
      {
        t: "code",
        v: 'const User = require("../models/User");\nconst S3_FOLDERS = require("../constants/s3BucketFolders");\nconst {\n  uploadToS3,\n  deleteFile,\n  generateUniqueFileName,\n  getImageUrl,\n} = require("../utils/s3_bucket");\n\n// PUT /users/profile-image\nconst uploadProfileImage = async (req, res) => {\n  try {\n    const userId = req.user.id;\n    const image = req.processedImages?.[0];\n\n    if (!image) {\n      return res.status(400).json({ message: "Profile image is required" });\n    }\n\n    const user = await User.findByPk(userId);\n    if (!user) return res.status(404).json({ message: "User not found" });\n\n    const oldKey = user.profileImage;\n\n    const fileName = generateUniqueFileName(userId, image.filename);\n    const key = await uploadToS3(\n      image.file,\n      S3_FOLDERS.PROFILE,\n      fileName,\n      image.mimetype\n    );\n\n    // Save the S3 key (not the URL) in the database\n    await user.update({ profileImage: key });\n\n    // Delete the old image only after the new one is safely stored\n    if (oldKey) await deleteFile(oldKey).catch(console.error);\n\n    return res.status(200).json({\n      message: "Profile image uploaded successfully",\n      data: { profileImage: getImageUrl(key) },\n    });\n  } catch (error) {\n    console.error("Upload profile image error:", error);\n    return res.status(500).json({ message: "Failed to upload profile image" });\n  }\n};\n\n// GET /users/:id\nconst getUser = async (req, res) => {\n  try {\n    const user = await User.findByPk(req.params.id);\n    if (!user) return res.status(404).json({ message: "User not found" });\n\n    return res.status(200).json({\n      data: {\n        ...user.toJSON(),\n        profileImage: getImageUrl(user.profileImage),\n      },\n    });\n  } catch (error) {\n    console.error("Get user error:", error);\n    return res.status(500).json({ message: "Failed to get user" });\n  }\n};\n\nmodule.exports = { uploadProfileImage, getUser };',
        lang: "controllers/userController.js",
      },
      {
        t: "note",
        v: "The controller uploads the new image first and deletes the old one afterwards. If the upload fails, the user keeps their existing image.",
        kind: "tip",
      },
    ],
  },
  {
    title: "Test it and verify CloudFront caching",
    body: [
      {
        t: "p",
        v: "Call the endpoint with a client such as Postman or curl:",
      },
      {
        t: "code",
        v: 'curl -X PUT http://localhost:3000/users/profile-image \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -F "image=@./photo.jpg"',
      },
      {
        t: "p",
        v: "Open the returned signed URL in your browser. Then open DevTools, go to the Network tab, select the image request, and check the response headers:",
      },
      {
        t: "code",
        v: "X-Cache: Miss from cloudfront   # first request, fetched from S3\nX-Cache: Hit from cloudfront    # later requests, served from the edge",
        lang: "response headers",
      },
      {
        t: "p",
        v: "A Hit means CloudFront served the image from its edge cache. Requests for an unsigned URL should return 403.",
      },
    ],
  },
  {
    title: "Best practices and troubleshooting",
    body: [
      {
        t: "h",
        v: "Best practices",
      },
      {
        t: "ul",
        v: [
          "Store S3 keys in the database and generate signed URLs when responding.",
          "Use short expiry times (hours or days) for sensitive images.",
          "Use unique, hashed file names so `immutable` caching is safe.",
          "Rotate access keys and key pairs periodically.",
          "Prefer IAM roles over access keys when running on AWS.",
        ],
      },
      {
        t: "h",
        v: "Common errors",
      },
      {
        t: "ul",
        v: [
          "`403 Forbidden` on every URL: the bucket policy for OAC is missing, or the wrong key ID is set.",
          "`403` only on signed URLs: `AWS_CLOUDFRONT_KEY_PAIR_ID` must be the public key ID, not your IAM access key.",
          "`AccessDenied` on upload: the IAM policy lacks `s3:PutObject` for that bucket.",
          "Image not updating: use a new file name for each upload rather than overwriting the same key.",
          "Signed URL always a cache Miss: query strings are part of the signature. Keep the CloudFront cache policy set to ignore the signing parameters.",
        ],
      },
      {
        t: "h",
        v: "Setup checklist",
      },
      {
        t: "ol",
        v: [
          "Create a private S3 bucket.",
          "Create an IAM user with a least-privilege policy and an access key.",
          "Create a CloudFront distribution with OAC.",
          "Generate an RSA key pair and upload the public key.",
          "Create a key group and require it on the behavior.",
          "Add all values to `.env`.",
          "Add the S3 utility, Multer and Sharp middleware.",
          "Test the upload and check `X-Cache`.",
        ],
      },
    ],
  },
];

/* ───────────────────────── UI pieces ───────────────────────── */
const rich = (s: string) =>
  s.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((p, i) =>
    p.length > 1 && p.startsWith("`") && p.endsWith("`") ? (
      <code
        key={i}
        className="break-words rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-neutral-100"
      >
        {p.slice(1, -1)}
      </code>
    ) : p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-white">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );

function Code({ v, lang }: { v: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(v);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  return (
    <div
      data-code
      className="min-w-0 overflow-hidden rounded-md border border-white/10 bg-black/40"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5 font-mono text-[9px] text-neutral-500">
        <span>{lang ?? "bash"}</span>
        <button
          type="button"
          data-copy
          onClick={copy}
          className="flex items-center gap-1 hover:text-white"
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          <span data-copy-label>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-[18px] text-neutral-200">
        <code>{v}</code>
      </pre>
    </div>
  );
}

function Tabs({ id, tabs, def }: Extract<Block, { t: "tabs" }>) {
  const [active, setActive] = useState(def ?? tabs[0].id);
  return (
    <div
      data-group={id}
      className="min-w-0 rounded-md border border-white/10 bg-white/[.02] p-3"
    >
      <div
        role="tablist"
        className="flex gap-1 overflow-x-auto rounded-md border border-white/10 p-1 font-mono text-[9px] text-neutral-400"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            data-tab={t.id}
            aria-selected={t.id === active}
            onClick={() => setActive(t.id)}
            className={`shrink-0 rounded px-3 py-1.5 ${t.id === active ? "bg-white/10 text-white" : "hover:text-white"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          data-panel={t.id}
          className={`mt-4 ${t.id === active ? "" : "hidden"}`}
        >
          <Blocks items={t.body} />
        </div>
      ))}
    </div>
  );
}

const NOTE = {
  note: ["NOTE", "text-neutral-400"],
  tip: ["TIP", "text-emerald-400"],
  warn: ["IMPORTANT", "text-amber-300"],
} as const;

function Blocks({ items }: { items: Block[] }) {
  return (
    <div className="min-w-0 space-y-4">
      {items.map((b, i) => {
        switch (b.t) {
          case "p":
            return <p key={i}>{rich(b.v)}</p>;
          case "h":
            return (
              <h3
                key={i}
                className="pt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-200"
              >
                {b.v}
              </h3>
            );
          case "ul":
          case "ol": {
            const List = b.t;
            return (
              <List
                key={i}
                className={`space-y-2 pl-5 ${b.t === "ol" ? "list-decimal" : "list-disc"} marker:text-neutral-600`}
              >
                {b.v.map((li, j) => (
                  <li key={j}>{rich(li)}</li>
                ))}
              </List>
            );
          }
          case "code":
            return <Code key={i} v={b.v} lang={b.lang} />;
          case "note": {
            const [label, color] = NOTE[b.kind ?? "note"];
            return (
              <div
                key={i}
                className="rounded-md border border-white/10 bg-white/[.02] px-3 py-2.5 text-[12px] leading-[19px] text-neutral-400"
              >
                <span
                  className={`mr-2 font-mono text-[9px] font-bold tracking-widest ${color}`}
                >
                  {label}
                </span>
                {rich(b.v)}
              </div>
            );
          }
          case "tabs":
            return <Tabs key={i} {...b} />;
        }
      })}
    </div>
  );
}

/* ───────────────────────── Page ───────────────────────── */
export default function S3CloudFrontImageGuide() {
  return (
    <article className="min-w-0">
      <header className="border-b border-white/10">
        <div className="px-4 py-8 sm:px-6">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 hover:text-white"
          >
            <ArrowLeft size={12} /> All blogs
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-neutral-500">
            <span>{META.date}</span>
            <span>·</span>
            <span>{META.read}</span>
          </div>
          <h1 className="mt-3 font-serif text-[32px] leading-[1.1] text-white sm:text-[42px]">
            {META.title}
          </h1>
          <p className="mt-4 text-[13px] leading-[22px] text-neutral-300">
            {META.desc}
          </p>
        </div>
        <div className="border-t border-white/10 px-4 py-5 sm:px-6">
          <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
            What we'll set up
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {META.stack.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1.5 font-mono text-[11px] text-neutral-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </header>

      <nav aria-label="On this page" className="border-b border-white/10">
        <div className="hatch h-6 border-b border-white/10" />
        <div className="px-4 py-3 sm:px-6">
          <h2 className="font-serif text-[22px] leading-none text-white">
            On This Page
          </h2>
        </div>
        <ol className="grid gap-x-6 gap-y-1.5 border-t border-white/10 px-4 py-4 font-mono text-[11px] text-neutral-400 sm:grid-cols-2 sm:px-6">
          {STEPS.map((s, i) => (
            <li key={s.title} className="min-w-0">
              <a
                href={`#step-${i + 1}`}
                className="flex gap-2 hover:text-primary hover:font-semibold"
              >
                <span className="text-neutral-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="truncate">{s.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {STEPS.map((s, i) => (
        <section
          key={s.title}
          id={`step-${i + 1}`}
          className="min-w-0 scroll-mt-12 border-b border-white/10"
        >
          <div className="hatch h-6 border-b border-white/10" />
          <div className="flex items-baseline gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
            <span className="font-mono text-[10px] text-neutral-500">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="min-w-0 font-serif text-[22px] leading-[1.15] text-white">
              {s.title}
            </h2>
          </div>
          <div className="px-4 py-5 text-[13px] leading-[22px] text-neutral-300 sm:px-6">
            <Blocks items={s.body} />
          </div>
        </section>
      ))}
    </article>
  );
}
