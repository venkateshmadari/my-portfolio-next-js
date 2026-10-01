"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", id: "home" },
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("home");

  // Handle section navigation when arriving at "/#section"
  useEffect(() => {
    if (pathname !== "/") return;

    const section = window.location.hash.replace("#", "");

    if (!section) {
      setActiveSection("home");
      return;
    }

    const timer = setTimeout(() => {
      const element = document.getElementById(section);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        setActiveSection(section);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleNavigation = (id: string) => {
    // Already on home page
    if (pathname === "/") {
      setActiveSection(id);

      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Update URL hash without reloading
      window.history.replaceState(null, "", `/#${id}`);

      return;
    }

    // Coming from another page
    router.push(`/#${id}`);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur">
      <div className="mx-auto flex h-11 max-w-[720px] items-center justify-between border-x border-white/10 px-4 sm:px-6">
        <Link href="/" className="font-serif text-base tracking-wider select-none text-white">
          Venkatesh
          <span className="ml-1 text-xs">♡</span>
        </Link>

        <nav className="flex items-center gap-4 text-[11px] text-neutral-400">
          {/* Desktop navigation */}
          {navItems.map((item) => {
            const isActive = pathname === "/" && activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`hidden cursor-pointer rounded px-2 py-1 transition-colors sm:block ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Blogs */}
          <Link
            href="/blogs"
            className={`rounded px-2 py-1 transition-colors ${
              pathname.startsWith("/blogs")
                ? "bg-white/10 text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Blogs
          </Link>
        </nav>
      </div>
    </header>
  );
}
