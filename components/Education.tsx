import { GraduationCap } from "lucide-react";
import Section from "./Section";
import { education } from "@/lib/data";
export default function Education() {
  return (
    <Section id="education" title="Where I Learned">
      <div className="divide-y divide-white/10">
        {education.map((e) => (
          <div key={e.t} className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between font-mono text-[9px] text-neutral-500">
              <span className="flex items-center gap-2">
                <GraduationCap size={20} />
                <span className="text-neutral-300 text-[10px]">{e.org}</span>
                <span className="rounded px-1.5 py-0.5 bg-emerald-900/70 text-emerald-300">
                  {e.tag}
                </span>
              </span>
              <span>{e.date}</span>
            </div>
            <h3 className="mt-2 text-[13px] font-bold text-white">{e.t}</h3>
            <p className="mt-1 text-[11px] leading-[15px] text-neutral-400">
              {e.d}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {e.tags.map((t) => (
                <span
                  key={t}
                  className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
