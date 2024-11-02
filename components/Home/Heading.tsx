import React from "react";
import { Cover } from "@/components/ui/cover";
import { sora_font } from "../preloader/Preloader";
import star from "@/public/star.svg"
import Image from "next/image";



export function Heading({ heading }: any) {
  return (
    <div>
      <h2 className={`text-2xl md:text-3xl flex items-center mt-10 dark:text-white text-black  text-center mb-4 ${sora_font.className}`}>
        <Image
          src={star}
          height={30}
          width={30}
          alt="star"
          className="object-contain"
        />
        <Cover>{heading}</Cover>
      </h2>
    </div>
  );
}
