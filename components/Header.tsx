"use client";

import { Search, Sun } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Home", id: "home" },
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];

export default function Header() {
  const [activeSection, setActiveSection] = useState("home");

  const handleNavigation = (id: string) => {
    setActiveSection(id);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur">
      <div className="mx-auto flex h-11 max-w-[720px] items-center justify-between border-x border-white/10 px-4 sm:px-6">
        <span className="font-serif text-base text-white tracking-wider">
          Venkatesh
          <span className="text-xs ml-1">♡⁠</span>
        </span>

        <nav className="flex items-center gap-4 text-[11px] text-neutral-400">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`hidden rounded px-2 py-1 transition-colors sm:block ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <a
            href="#contact"
            className="flex h-8 items-center justify-center rounded-md border border-white/15 px-3 font-mono text-[10px] text-neutral-400 md:hidden"
          >
            Hire me
          </a>
        </nav>
      </div>
    </header>
  );
}
