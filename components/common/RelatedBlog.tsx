import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const RelatedBlog = ({ title, href }: { title: string; href: string }) => {
  return (
    <section className="min-w-0 border-b border-white/10">
      <div className="hatch h-6 border-b border-white/10" />
      <div className="flex flex-col items-start justify-between gap-4 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-widest text-neutral-200 font-medium">
            Related blog
          </p>
          <p className="mt-2 font-serif text-[20px] leading-[1.15] text-white">
            {title}
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-white hover:bg-primary px-4 py-2 text-xs font-semibold text-black"
        >
          Read next <ArrowUpRight size={12} />
        </Link>
      </div>
      <div className="border-t border-white/10 px-4 py-4 sm:px-6">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 leading-relaxed font-medium text-xs text-neutral-300 hover:text-primary"
        >
          <ArrowLeft size={12} /> Back to all blogs
        </Link>
      </div>
    </section>
  );
};

export default RelatedBlog;
