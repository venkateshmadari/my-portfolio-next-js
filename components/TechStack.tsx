"use client";

import { useState } from "react";
import Section from "./Section";
import { tech } from "@/lib/data";

const tabs = [
  "All",
  "Languages",
  "Frontend",
  "Backend",
  "Databases",
  "DevOps & Tools",
];

export default function TechStack() {
  const [tab, setTab] = useState("All");

  return (
    <Section
      id="skills"
      title="My Toolbox"
      right={
        <span className="text-xs font-semibold flex items-center gap-2 text-neutral-400 transition-colors hover:text-primary">
          ( select tab to filter )
        </span>
      }
    >
      <div className="p-4 sm:p-6">
        <div
          role="tablist"
          className="flex gap-1 overflow-x-auto rounded-md border  border-white/10  text-sm font-medium leading-relaxed p-1 text-neutral-300"
        >
          {tabs.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={t === tab}
              data-tab={t}
              onClick={() => setTab(t)}
              className={`shrink-0 rounded px-3 py-1.5 cursor-pointer ${
                t === tab
                  ? "bg-white/10 text-white font-semibold"
                  : "hover:text-white hover:font-semibold"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tech
            .filter(({ category }) => tab === "All" || category === tab)
            .map(({ name, category, color }) => (
              <span
                key={name}
                data-cat={category}
                style={{ "--tech-color": color } as React.CSSProperties}
                className="group flex cursor-pointer items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1.5 text-sm font-medium leading-relaxed text-white transition-colors  hover:border-[var(--tech-color)]"
              >
                <i className="size-2 rounded-sm bg-neutral-600 transition-colors group-hover:bg-[var(--tech-color)]" />
                {name}
              </span>
            ))}
        </div>
      </div>
    </Section>
  );
}
