import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { Blog, MAX_TAGS } from "./BlogList";


export default function BlogCard({ blog }: { blog: Blog }) {
  const extra = blog.techStacks.length - MAX_TAGS;
  return (
    <Link
      href={blog.link}
      className="group flex min-w-0 flex-col rounded-md border border-white/10 bg-white/[.02] p-3 transition-colors hover:border-white/25 hover:bg-white/[.04]"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-neutral-800">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          sizes="(min-width: 640px) 340px, 100vw"
          loading="eager"
          className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest text-neutral-200 backdrop-blur">
          {blog.name}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5 font-mono text-[9px] text-neutral-500">
        <Clock size={10} />
        <span>{blog.minRead} min read</span>
      </div>

      <h3 className="mt-1.5 break-words font-serif text-[19px] leading-[1.2] text-white">
        {blog.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-[11px] leading-[17px] text-neutral-400">
        {blog.description}
      </p>

      <div className="mt-3 flex flex-1 flex-wrap content-start gap-1">
        {blog.techStacks.slice(0, MAX_TAGS).map((t) => (
          <span
            key={t}
            className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[8px] text-neutral-400"
          >
            {t}
          </span>
        ))}
        {extra > 0 && (
          <span className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[8px] text-neutral-500">
            +{extra}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[10px] text-neutral-400 group-hover:text-white">
        <span>Read article</span>
        <ArrowUpRight
          size={12}
          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
    </Link>
  );
}