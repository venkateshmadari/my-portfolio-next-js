import Section from "./Section";
import { stats, roles } from "@/lib/data";
export default function Experience() {
  return (
    <Section id="experience" title="Work Journey">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between text-[12px]">
          <p>
            <b className="text-white">Full-Stack Developer</b>{" "}
            <span className="text-neutral-500">· Spack Digi Solutions</span>
          </p>
          <span className="font-mono text-[9px] text-neutral-500">
            May 2024 · Present
          </span>
        </div>
        <p className="mt-2 text-[13px] leading-[16px] text-neutral-300">
          Designing and shipping scalable SaaS features across REST API services
          and React.js/Next.js frontends, on cloud-native, high-availability AWS
          infrastructure.
        </p>
        <div className="mt-4 grid grid-cols-2 divide-x divide-primary/30 border border-primary/30 sm:grid-cols-4">
          {stats.map(([n, l]) => (
            <div key={l} className="p-3">
              <p className="font-mono text-base text-primary">{n}</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-white">
                {l}
              </p>
            </div>
          ))}
        </div>
        <h3 className="mt-8 font-serif text-[19px] text-neutral-300">
          Work History
        </h3>
        <p className="text-[10px] text-neutral-400 tracking-wider">
          Roles at Spack Digi Solutions, Hyderabad.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3">
          {roles.map((f) => (
            <div
              key={f.t}
              className="rounded-md border border-white/10 bg-white/[.02] p-3"
            >
              <h4 className="text-[12px] font-semibold text-white">{f.t}</h4>
              <p className="font-mono text-[10px] text-neutral-400">{f.m}</p>
              <p className="mt-2 text-[13px] leading-[20px] text-neutral-300">
                {f.d}
              </p>

              <div className="mt-3 flex flex-wrap gap-1">
                {f.s.map((s) => (
                  <span
                    key={s}
                    className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-md border border-dashed border-primary/50 px-3 py-2 text-[12px] text-neutral-300">
          Delivered 3+ freelance projects with 100% on-time completion,
          resulting in strong client referrals and repeat business.
        </p>
      </div>
    </Section>
  );
}
