import Section from "./Section";
import { stats, roles } from "@/lib/data";
export default function Experience() {
  return (
    <Section id="experience" title="Work Journey">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between md:text-base text-sm font-medium leading-relaxed">
          <p>
            <b className="text-white ">Full-Stack Developer</b>{" "}
            <span className="text-neutral-400 md:text-sm text-xs">· Spack Digi Solutions</span>
          </p>
          <span className="font-mono text-xs text-neutral-400">
            May 2024 · Present
          </span>
        </div>
        <p className="mt-2 md:text-base text-sm font-medium leading-relaxed text-neutral-300">
          Designing and shipping scalable SaaS features across REST API services
          and React.js/Next.js frontends, on cloud-native, high-availability AWS
          infrastructure.
        </p>
        <div className="mt-4 grid grid-cols-2 divide-x divide-primary/30 border border-primary/30">
          {stats.map(([n, l]) => (
            <div key={l} className="p-3">
              <p className="font-mono md:text-lg text-base text-primary">{n}</p>
              <p className="mt-1 text-xs font-medium leading-relaxed uppercase tracking-wider text-white">
                {l}
              </p>
            </div>
          ))}
        </div>
        <h3 className="mt-8 font-serif md:text-lg text-sm text-primary font-semibold tracking-widest">
          Work History
        </h3>
        <p className="md:text-sm text-sm text-neutral-300 tracking-wider">
          Roles at Spack Digi Solutions, Hyderabad.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3">
          {roles.map((f) => (
            <div
              key={f.t}
              className="rounded-md border border-white/10 bg-white/[.02] p-3"
            >
              <h4 className="md:text-base text-sm leading-relaxed font-semibold text-white">{f.t}</h4>
              <p className="md:text-sm text-xs font-semibold text-neutral-500">{f.m}</p>
              <p className="mt-2 md:text-sm text-xs font-medium leading-relaxed text-neutral-200">
                {f.d}
              </p>

              <div className="mt-3 flex flex-wrap gap-1">
                {f.s.map((s) => (
                  <span
                    key={s}
                    className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-xs text-neutral-300 cursor-pointer hover:bg-primary/10 hover:text-primary transition-all duration-200 ease-in-out"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-md border border-dashed border-primary/50 px-3 py-2 md:text-base text-sm font-medium leading-relaxed text-primary">
          Delivered 3+ freelance projects with 100% on-time completion,
          resulting in strong client referrals and repeat business.
        </p>
      </div>
    </Section>
  );
}
