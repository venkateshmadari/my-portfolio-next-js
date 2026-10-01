import Link from "next/link";
import Section from "./Section";
import { blogs } from "./blogs/BlogList";
import BlogCard from "./blogs/BlogCard";
import { ArrowUpRight } from "lucide-react";

export default function HomeBlogs() {
  const latestBlogs = blogs?.slice(0, 2);

  return (
    <Section
      id="blogs"
      title="Field Notes"
      right={
        <Link
          href="/blogs"
          className="font-mono text-[10px] flex items-center gap-2 text-neutral-400 transition-colors hover:text-primary"
        >
          View all articles
          <ArrowUpRight
            size={12}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      }
    >
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
        {latestBlogs?.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </Section>
  );
}
