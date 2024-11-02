"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import { GoHome, GoHomeFill } from "react-icons/go";
import { RiUserStarLine, RiUserStarFill } from "react-icons/ri";
import { FaRegStar, FaStar } from "react-icons/fa";
import { RiContactsLine, RiContactsFill } from "react-icons/ri";

// Define nav items with active/inactive icons
const navItems = [
  { activeIcon: GoHomeFill, inactiveIcon: GoHome, label: "Home", href: "/" },
  { activeIcon: FaStar, inactiveIcon: FaRegStar, label: "Skills", href: "/skills" },
  { activeIcon: RiContactsFill, inactiveIcon: RiContactsLine, label: "Contact", href: "/contact" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  return (
    <div className=" flex items-center justify-center">
      <nav className="fixed bottom-0 left-0 w-full z-40 pl-1 dark:bg-gray-900 bg-white md:ml-3 flex justify-center items-center md:w-16 md:top-1/2 md:-translate-y-1/2 md:flex-col md:border border-t  rounded-none md:rounded-full">
        <div className="flex w-full items-center justify-evenly md:flex-col md:items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = isActive ? item.activeIcon : item.inactiveIcon;

            return (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-center rounded-none px-3 md:h-16 md:w-16 hover:bg-transparent lg:w-full lg:justify-start lg:px-4"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 lg:mr-2",
                      isActive ? "text-shade" : "text-black dark:text-white"
                    )}
                  />
                </Button>
              </Link>
            );
          })}
          <Button
            variant="ghost"
            className="h-16 justify-center rounded-none pr-5 hover:bg-transparent text-black dark:text-white lg:justify-start"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <MdOutlineLightMode className="h-5 w-5" />
            ) : (
              <MdDarkMode className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>
    </div>
  );
}
