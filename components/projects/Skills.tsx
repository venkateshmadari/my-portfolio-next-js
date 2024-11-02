"use client";
import React from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { Heading } from "../Home/Heading";
import { sora_font } from "../preloader/Preloader";
import SkillsGrid from "./SkillsGrid";

export function Skills() {
  return (
    <div className="h-full rounded-md dark:bg-black bg-white flex flex-col items-center justify-start relative w-full mb-24">
      <Heading heading={"Skills"} />
      <div className="flex items-center  justify-center">
        <span className="h-[1px] md:w-[150px]  w-[50px] bg-gradient-to-r  from-shade to-[#FF3600] mt-3 hidden sm:block" />
        <p
          className={`${sora_font.className} uppercase mt-4 md:text-base text-xs md:px-4 px-2`}
        >
          {" "}
          Skills I utilize to effectively complete tasks
        </p>
        <span className="h-[1px] md:w-[150px] w-[50px]  bg-gradient-to-r from-[#FF3600] to-shade mt-3 hidden sm:block" />
      </div>
      <SkillsGrid />
     
      <ShootingStars />
      <StarsBackground />
    </div>
  );
}
