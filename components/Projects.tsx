import { Globe } from "lucide-react";
import { Github } from "./icons";
import Section from "./Section";
import { projects } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
export default function Projects() {
  return (
    <Section
      id="projects"
      title="Things I've Built"
      // right={
      //   <div className="flex gap-1 rounded-md border border-white/10 p-0.5 font-mono text-[11px] text-neutral-400">
      //     {["All", "Frontend", "Backend", "Fullstack"].map((t, i) => (
      //       <span
      //         key={t}
      //         className={`rounded px-2 py-1 ${i === 0 ? "bg-white/10 text-white" : ""}`}
      //       >
      //         {t}
      //       </span>
      //     ))}
      //   </div>
      // }
    >
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
        {projects.map((p) => (
          <article
            key={p.name}
            className="flex flex-col rounded-md border border-white/10 bg-white/[.02] p-3"
          >
            <div className="relative aspect-video overflow-hidden rounded-sm bg-neutral-800">
              <Image
                src={p.imagePath}
                alt={p.name}
                fill
                sizes="(min-width: 640px) 340px, 100vw"
                loading="eager"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />

              {/* <span className="absolute left-2 top-2 rounded bg-primary text-black px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest backdrop-blur">
                {p.tag}
              </span> */}

              {p.featured && (
                <span className="absolute right-2 top-2 rounded bg-amber-900/70 px-1.5 py-0.5 font-mono text-[8px] text-amber-300">
                  FEATURED
                </span>
              )}
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <h3 className="mt-1.5 wrap-break-words font-semibold tracking-wide font-serif text-[19px] leading-[1.2] text-white">
                {p.name}
              </h3>{" "}
            </div>
            <p className="mt-1 line-clamp-4 text-sm font-medium leading-relaxed text-neutral-300">
              {p.desc}
            </p>
            <div className="mt-3 flex flex-1 flex-wrap content-start gap-1">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="rounded cursor-pointer font-medium hover:bg-primary/10 hover:text-primary transition-all duration-200 ease-in-out border border-white/10 px-1.5 py-0.5 text-xs text-neutral-300"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-2.5 flex justify-end gap-2 text-neutral-400">
              {p.website ? (
                <Link href={p.website} target="_blank">
                  <Globe size={14} className="hover:text-primary" />
                </Link>
              ) : null}

              {"github" in p && p.github ? (
                <a href={p.github} target="_blank" rel="noreferrer">
                  <Github size={14} className="hover:text-primary" />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
