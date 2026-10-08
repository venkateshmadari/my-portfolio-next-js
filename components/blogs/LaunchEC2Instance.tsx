"use client";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, Copy } from "lucide-react";

/* ───────────── SEO / meta ─────────────
   Keep these strings in sync with `metadata` in app/blogs/<slug>/page.tsx
   (a "use client" file can't export metadata). */
const SEO = {
  title: "How to Launch an AWS EC2 Instance with Ubuntu and Connect via SSH",
  description:
    "Step-by-step guide to launching an Ubuntu EC2 instance on AWS: choose a region and instance type, create a key pair, set security group rules, and connect from the browser or an SSH client.",
  h1: "How to Launch an AWS EC2 Instance (Ubuntu) and Connect via SSH",
  date: "2026-10-08",
  dateLabel: "Oct 08, 2026",
  read: "9 min read",
  tags: ["AWS", "EC2", "Ubuntu", "SSH"],
  stack: ["AWS EC2", "Ubuntu", "IAM", "Key Pair", "Security Group", "SSH"],
  nextHref: "/blogs/aws-ec2-production-deployment",
  nextTitle: "AWS EC2 Production Deployment Guide",
};

type Block =
  | { t: "p"; v: string }
  | { t: "h"; v: string }
  | { t: "ul" | "ol"; v: string[] }
  | { t: "code"; v: string; lang?: string }
  | { t: "note"; v: string; kind?: "note" | "warn" | "tip" }
  | { t: "table"; head: string[]; rows: string[][] }
  | {
      t: "tabs";
      id: string;
      def?: string;
      tabs: { id: string; label: string; body: Block[] }[];
    };
type Step = { title: string; body: Block[] };

const SSH_CMD =
  'ssh -i "my-project.pem" ubuntu@ec2-xx-xxx-xx-xxx.ap-south-2.compute.amazonaws.com';

const STEPS: Step[] = [
  {
    title: "Before you start",
    body: [
      {
        t: "p",
        v: "In this guide you will launch an Ubuntu server on Amazon EC2 and log in to it. It takes about ten minutes. You need:",
      },
      {
        t: "ul",
        v: [
          "An AWS account and an IAM user to sign in with. Don't use the root account for daily work.",
          "A terminal: Terminal on macOS or Linux, PowerShell or Command Prompt on Windows.",
          "The server name (`my-backend-project`) and key pair name (`my-project`) used below are examples. Use your own.",
        ],
      },
      {
        t: "note",
        kind: "tip",
        v: "EC2 charges while an instance is running. When you finish experimenting, stop or terminate it from the same console.",
      },
    ],
  },
  {
    title: "Open EC2 and choose your region",
    body: [
      {
        t: "ol",
        v: [
          "Sign in to the AWS Console with your IAM user.",
          "Use the search bar at the top, type `EC2` and open the service.",
        ],
      },
      {
        t: "p",
        v: "Before you create anything, check the region selector in the top-right corner and pick the region nearest to your users or your team, for example Asia Pacific (Hyderabad) `ap-south-2`.",
      },
      {
        t: "note",
        kind: "warn",
        v: "Resources live in one region. If you switch regions later, your instances will look like they have disappeared. Switch back to see them.",
      },
      { t: "p", v: "On the EC2 dashboard click `Launch instance`." },
    ],
  },
  {
    title: "Name your server",
    body: [
      {
        t: "p",
        v: "Under `Name and tags`, set `Name` to something that tells you what the server is for, for example:",
      },
      { t: "code", lang: "Name", v: "my-backend-project" },
      {
        t: "p",
        v: "This becomes the `Name` tag you will see in the instances list.",
      },
    ],
  },
  {
    title: "Choose the Ubuntu image",
    body: [
      {
        t: "p",
        v: "Under `Application and OS Images (Amazon Machine Image)`, open the `Quick Start` tab and select `Ubuntu`. The console picks a current Ubuntu Server LTS Amazon Machine Image (AMI) for you. Keep that default.",
      },
      {
        t: "p",
        v: "An AMI is the template your server boots from, here the operating system. Because you chose Ubuntu, the default login user is `ubuntu`, which you will need when you connect.",
      },
    ],
  },
  {
    title: "Pick the instance type",
    body: [
      {
        t: "p",
        v: "The instance type sets how much CPU and memory your server gets. For a Node.js backend with a database and Nginx on the same machine, this guide uses `t3.medium`.",
      },
      {
        t: "table",
        head: ["Type", "vCPU", "RAM", "Good for", "Free tier"],
        rows: [
          [
            "t3.micro",
            "2",
            "1 GiB",
            "Learning, tiny test apps",
            "Usually eligible",
          ],
          [
            "t3.small",
            "2",
            "2 GiB",
            "Small apps, light traffic",
            "Check the console label",
          ],
          [
            "t3.medium",
            "2",
            "4 GiB",
            "App + MySQL + Nginx together",
            "Not eligible",
          ],
        ],
      },
      {
        t: "ul",
        v: [
          "vCPU is the number of virtual processor cores. RAM is the memory your app, database and operating system share.",
          "T3 instances are burstable. They run at a baseline CPU level and can burst higher for short periods, which suits most small web backends.",
          "Free tier rules depend on your account type and change over time. The console marks eligible types with a `Free tier eligible` label, so trust that label. `t3.medium` is not free, so if you only want to practise, choose an eligible type.",
        ],
      },
      {
        t: "note",
        kind: "tip",
        v: "Running MySQL and Node.js on a 1 GiB machine often runs out of memory during `npm install` or builds. That is why `t3.medium` is the safer starting point for this setup.",
      },
    ],
  },
  {
    title: "Create the key pair",
    body: [
      {
        t: "p",
        v: "The key pair is how you prove who you are when you log in over SSH. AWS keeps the public half. You download the private half once.",
      },
      {
        t: "ol",
        v: [
          "Under `Key pair (login)` click `Create new key pair`.",
          "Key pair name: `my-project`.",
          "Key pair type: `RSA`.",
          "Private key file format: `.pem`.",
          "Click `Create key pair`.",
        ],
      },
      {
        t: "p",
        v: "The browser downloads `my-project.pem`. Then select that key pair in the dropdown.",
      },
      {
        t: "note",
        kind: "warn",
        v: "AWS cannot show the private key again. Keep the `.pem` file somewhere safe and never commit it to Git or share it. If you lose it, you lose SSH access to this instance.",
      },
    ],
  },
  {
    title: "Configure network settings",
    body: [
      {
        t: "p",
        v: "Under `Network settings` you create the firewall rules (a security group) for the instance. You will see three checkboxes:",
      },
      {
        t: "ul",
        v: [
          "`Allow SSH traffic from`: lets you connect to the instance. It is already checked.",
          "`Allow HTTPS traffic from the internet`: needed to serve a site or API over HTTPS. Check it.",
          "`Allow HTTP traffic from the internet`: needed to serve a site or API over HTTP. Check it.",
        ],
      },
      { t: "p", v: "Leave everything else on its defaults." },
      {
        t: "note",
        kind: "warn",
        v: "Never leave SSH open to `0.0.0.0/0` on a real server. Restrict port 22 to your own address in the form `xx.xxx.xx.xxx/32`. You can find your public IP at `https://checkip.amazonaws.com/`.",
      },
      {
        t: "p",
        v: "For now the default is fine. You will lock the rules down at the end of your deployment, once you know exactly which services your server runs.",
      },
    ],
  },
  {
    title: "Launch the instance",
    body: [
      {
        t: "p",
        v: "Review the `Summary` panel (name, image, instance type, key pair, storage), then click `Launch instance`. The default storage is 8 GiB, which is enough for this walkthrough. Increase it if you plan to host a database or many uploads.",
      },
      {
        t: "p",
        v: "AWS shows a success message with your instance ID, for example `i-0123456789abcdef0`. Click it, or open `EC2 → Instances`, and wait:",
      },
      {
        t: "ul",
        v: [
          "`Instance state` changes from `Pending` to `Running`.",
          "`Status check` changes from `Initializing` to `2/2 checks passed`.",
        ],
      },
      {
        t: "p",
        v: "Once the instance is running and the checks pass, you can connect.",
      },
    ],
  },
  {
    title: "Connect to your instance",
    body: [
      {
        t: "p",
        v: "Click the instance ID to open its details page, then click `Connect` at the top right. There are two ways to log in.",
      },
      {
        t: "tabs",
        id: "connect",
        def: "ssh",
        tabs: [
          {
            id: "ssh",
            label: "SSH client",
            body: [
              {
                t: "p",
                v: "This is the method to use on any real server. On the `SSH client` tab, copy the example under `Connect to your instance using its Public DNS`. It looks like this:",
              },
              { t: "code", lang: "bash", v: SSH_CMD },
              {
                t: "tabs",
                id: "os",
                def: "mac",
                tabs: [
                  {
                    id: "mac",
                    label: "macOS / Linux",
                    body: [
                      {
                        t: "ol",
                        v: [
                          "Open Terminal.",
                          "Go to the folder where the `.pem` file was downloaded.",
                          "Make the key readable only by you, or SSH will refuse to use it.",
                          "Run the command you copied.",
                        ],
                      },
                      {
                        t: "code",
                        lang: "bash",
                        v:
                          "cd ~/Downloads\nchmod 400 my-project.pem\n" +
                          SSH_CMD,
                      },
                    ],
                  },
                  {
                    id: "win",
                    label: "Windows",
                    body: [
                      {
                        t: "p",
                        v: "Windows 10 and 11 include an OpenSSH client. Open PowerShell and run:",
                      },
                      {
                        t: "code",
                        lang: "powershell",
                        v: "cd $HOME\\Downloads\n" + SSH_CMD,
                      },
                      {
                        t: "p",
                        v: "If you see an `UNPROTECTED PRIVATE KEY FILE` error, restrict the file to your user and try again:",
                      },
                      {
                        t: "code",
                        lang: "powershell",
                        v: 'icacls .\\my-project.pem /inheritance:r\nicacls .\\my-project.pem /grant:r "$($env:USERNAME):(R)"',
                      },
                    ],
                  },
                ],
              },
              {
                t: "p",
                v: "The first time, SSH asks whether to trust the host fingerprint. Type `yes` and press Enter.",
              },
              {
                t: "p",
                v: "You are in when the prompt changes to something like `ubuntu@ip-xx-xx-xx-xxx:~$`. That address is the server's private hostname, not the public one you connected with.",
              },
              {
                t: "note",
                v: "If port 22 allows only your IP (`/32`), you can connect from that IP only. Anyone else, and you on a different network, is blocked until the rule is updated.",
              },
            ],
          },
          {
            id: "browser",
            label: "In the web browser",
            body: [
              {
                t: "p",
                v: "Open the `EC2 Instance Connect` tab and click `Connect`. A new browser tab opens with a terminal already logged in to the instance. There is no key file or setup needed.",
              },
              {
                t: "note",
                kind: "warn",
                v: "This works only while port 22 is reachable from AWS's Instance Connect service, which is the case when SSH is open to `0.0.0.0/0`. Once you restrict port 22 to your own IP as `your-ip/32`, the browser terminal can no longer connect. Use the SSH client from then on.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Verify you are logged in",
    body: [
      { t: "p", v: "Run this in the terminal:" },
      { t: "code", lang: "bash", v: "whoami" },
      { t: "p", v: "It should print:" },
      { t: "code", lang: "output", v: "ubuntu" },
      {
        t: "p",
        v: "Your Ubuntu server is up and you have shell access. You can also check the OS version and the memory it has:",
      },
      { t: "code", lang: "bash", v: "lsb_release -a\nfree -h\nnproc" },
    ],
  },
  {
    title: "Troubleshooting connection errors",
    body: [
      {
        t: "ul",
        v: [
          "`Connection timed out`: port 22 is blocked for your current IP. Open the instance's security group, edit the inbound SSH rule and set the source to `My IP`. Your home IP changes from time to time, so update it when it does.",
          "`Permissions 0644 for 'my-project.pem' are too open`: run `chmod 400 my-project.pem` (macOS/Linux) or use the `icacls` commands from the Windows tab.",
          "`Permission denied (publickey)`: you are using the wrong username or key. For Ubuntu the user is `ubuntu`, not `ec2-user` or `root`, and the key must be the one chosen at launch.",
          "`No such file or directory` for the key: your terminal is not in the folder that holds `my-project.pem`. Use `cd` to go there, or pass the full path to `-i`.",
          "Browser connect fails: the SSH rule is probably restricted to your IP. Use the SSH client instead.",
          "The address stopped working after a restart: the public DNS and public IP change when an instance is stopped and started. Copy the new address from the console, or attach an Elastic IP.",
        ],
      },
    ],
  },
  {
    title: "Good habits and next steps",
    body: [
      {
        t: "ul",
        v: [
          "Restrict SSH to your own `/32` address once the setup is finished, and keep only the ports you actually use open.",
          "Attach an Elastic IP if the server needs a stable address, for example when you point a domain at it.",
          "Stop the instance when you don't need it, and terminate it (and delete unused storage) when you are done for good.",
          "Keep the `.pem` file private and back it up somewhere safe.",
        ],
      },
      {
        t: "p",
        v: "Your server is ready. The next step is installing the runtime, your app, a web server and SSL on it.",
      },
    ],
  },
];

/* ───────────── UI ───────────── */
const rich = (s: string) =>
  s.split(/(`[^`]+`)/g).map((p, i) => {
    if (p.length > 1 && p.startsWith("`") && p.endsWith("`")) {
      const text = p.slice(1, -1);
      return /^https?:\/\//.test(text) ? (
        <a
          key={i}
          href={text}
          target="_blank"
          rel="noreferrer"
          className="break-all rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-white underline underline-offset-2 hover:bg-white/20"
        >
          {text}
        </a>
      ) : (
        <code
          key={i}
          className="break-words rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-neutral-100"
        >
          {text}
        </code>
      );
    }
    return <span key={i}>{p}</span>;
  });

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
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-1.5 font-mono text-[9px] text-neutral-500">
        <span className="min-w-0 truncate">{lang ?? "bash"}</span>
        <button
          type="button"
          data-copy
          onClick={copy}
          className="flex shrink-0 items-center gap-1 hover:text-white"
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
          case "table":
            return (
              <div
                key={i}
                className="min-w-0 overflow-x-auto rounded-md border border-white/10"
              >
                <table className="w-full min-w-[460px] border-collapse text-left text-[11px] leading-[17px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[.03] font-mono text-[9px] uppercase tracking-widest text-neutral-500">
                      {b.head.map((h) => (
                        <th key={h} className="px-3 py-2 font-normal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r) => (
                      <tr
                        key={r[0]}
                        className="border-b border-white/10 last:border-0"
                      >
                        {r.map((cell, j) => (
                          <td
                            key={j}
                            className={`px-3 py-2.5 ${j === 0 ? "font-mono text-white" : "text-neutral-400"}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "tabs":
            return <Tabs key={i} {...b} />;
        }
      })}
    </div>
  );
}

/* ───────────── Page ───────────── */
export default function LaunchEC2Instance() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: SEO.title,
    description: SEO.description,
    datePublished: SEO.date,
    dateModified: SEO.date,
    author: { "@type": "Person", name: "Madari Venkatesh" },
    keywords: SEO.tags.join(", "),
  };
  return (
    <article className="min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="border-b border-white/10">
        <div className="hatch h-6 border-b border-white/10" />
        <div className="px-4 py-8 sm:px-6">
          <a
            href="/blogs"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] text-neutral-500 hover:text-white"
          >
            <ArrowLeft size={12} /> All articles
          </a>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-neutral-500">
            <time dateTime={SEO.date}>{SEO.dateLabel}</time>
            <span>·</span>
            <span>{SEO.read}</span>
          </div>
          <h1 className="mt-3 font-serif text-[32px] leading-[1.1] text-white sm:text-[42px]">
            {SEO.h1}
          </h1>
          <p className="mt-4 text-[13px] leading-[22px] text-neutral-400">
            {SEO.description}
          </p>
        </div>
        <div className="border-t border-white/10 px-4 py-5 sm:px-6">
          <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
            What you'll use
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SEO.stack.map((s) => (
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
        <ol className="grid gap-x-6 gap-y-1.5 border-t border-white/10 px-4 py-4 font-mono text-[11px] text-neutral-430 sm:grid-cols-2 sm:px-6">
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

      <section className="min-w-0 border-b border-white/10">
        <div className="hatch h-6 border-b border-white/10" />
        <div className="flex flex-col items-start justify-between gap-4 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
          <div className="min-w-0">
            <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
              Next article
            </p>
            <p className="mt-2 font-serif text-[20px] leading-[1.15] text-white">
              {SEO.nextTitle}
            </p>
          </div>
          <a
            href={SEO.nextHref}
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-2 text-[11px] font-semibold text-black"
          >
            Continue <ArrowUpRight size={12} />
          </a>
        </div>
        <div className="border-t border-white/10 px-4 py-4 sm:px-6">
          <a
            href="/blogs"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] text-neutral-500 hover:text-white"
          >
            <ArrowLeft size={12} /> Back to all articles
          </a>
        </div>
      </section>
    </article>
  );
}
