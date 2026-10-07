import BlogCard from "./BlogCard";

export type Blog = {
  id: string;
  name: string; // short category label shown on the image, e.g. "DevOps"
  image: string; // path inside /public, e.g. "/blogs/aws-ec2-deployment.png"
  title: string;
  description: string;
  techStacks: string[];
  minRead: number;
  link: string; 
};

export const blogs: Blog[] = [
    {
    id: "s3-cloudfront-image-upload-guide",
    name: "AWS",
    image: "/s3-cloudfront-image-upload.png",
    title: "How to Upload Images to Amazon S3 and Serve Them with CloudFront Signed URLs in Node.js",
    description:
      "Store images in a private S3 bucket, optimize them with Sharp, and deliver them securely through CloudFront using short-lived signed URLs.",
    techStacks: ["Amazon S3", "CloudFront", "IAM", "Node.js", "Multer", "Sharp", "Pem"],
    minRead: 15,
    link: "/blogs/s3-cloudfront-image-upload-guide",
  },
  {
    id: "aws-ec2-production-deployment",
    name: "DevOps",
    image: "/aws-ec2-deployment.png",
    title: "AWS EC2 Production Deployment Guide",
    description:
      "Ubuntu, a GitHub repo, Node.js, PM2, MySQL, Nginx, UFW, DNS and SSL. Take a Node.js app from an empty EC2 instance to a secured production URL.",
    techStacks: ["AWS EC2", "Node.js", "PM2", "Nginx", "MySQL", "SSL"],
    minRead: 18,
    link: "/blogs/aws-ec2-production-deployment",
  },
  {
    id: "book-my-show-hld",
    name: "System Design",
    image: "/bookmyshow-hld.png",
    title: "Book My Show HLD",
    description:
      "Ticket booking looks simple: pick a seat, pay, done. The hard part is guaranteeing that one seat belongs to exactly one person.",
    techStacks: ["Load Balancing", "Redis", "Kafka", "Elasticsearch"],
    minRead: 4,
    link: "/blogs/book-my-show-hld",
  },

];

export const MAX_TAGS = 4;


export default function BlogList({ posts = blogs }: { posts?: Blog[] }) {
  return (
    <section
      id="blogs"
      className="min-w-0 border-b border-white/10 min-h-[61vh]"
    >
      <div className="hatch h-6 border-b border-white/10" />
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-white/10 px-4 py-3 sm:px-6">
        <h1 className="font-serif text-[22px] leading-none text-white">
          Field Notes
        </h1>
        <span className="font-mono text-[9px] text-neutral-500">
          {posts.length} {posts.length === 1 ? "article" : "articles"}
        </span>
      </div>
      <p className="px-4 pt-5 text-[12px] leading-[19px] text-neutral-400 sm:px-6">
        Guides and write-ups from things I've built, deployed and broken along
        the way.
      </p>
      {posts.length ? (
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-6">
          {posts.map((b) => (
            <BlogCard key={b.id} blog={b} />
          ))}
        </div>
      ) : (
        <p className="px-4 py-12 text-center font-mono text-[10px] text-neutral-500 sm:px-6">
          Nothing published yet. Check back soon.
        </p>
      )}
    </section>
  );
}
