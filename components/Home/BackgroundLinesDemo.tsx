import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Sora } from "next/font/google";
import { Sevillana } from "next/font/google";
import { Yesteryear } from "next/font/google";
import { Poppins } from "next/font/google";
import { Monsieur_La_Doulaise } from "next/font/google";

export const pop = Poppins({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const yesteryear = Yesteryear({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
export const sevillana = Sevillana({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
export const mon = Monsieur_La_Doulaise({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});


const sora_font = Sora({
  subsets: ["latin"],
});


export function BackgroundLinesDemo() {
  return (
    <>
      <BackgroundLines className="flex items-center justify-center w-full flex-col -mt-5 md:mt-0">
        <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl  md:py-10 relative z-20 font-bold tracking-tight">
          {/* Small and Medium screens */}
          <span
            className={`text-gradient text-3xl capitalize ${sora_font.className} md:text-[80px]  lg:hidden`}
          >
            venkatesh madari
          </span>

          <br />

          {/* Large screens only */}
          <span
            className={` text-3xl text-shade capitalize ${mon.className} lg:text-[130px] hidden lg:block`}
          >
            Venkatesh Madari
          </span>
        </h2>
        <div className="flex items-center justify-center">
          <span className="h-[1px] md:w-[150px]  w-[50px] bg-gradient-to-r  from-shade to-[#FF3600] mt-3" />
          <p
            className={`${sora_font.className} uppercase mt-4 md:text-base text-xs md:px-4 px-2`}
          >
            {" "}
            a  web Developer
          </p>
          <span className="h-[1px] md:w-[150px] w-[50px]  bg-gradient-to-r from-[#FF3600] to-shade mt-3" />
        </div>
      {/* <SocialLinks /> */}
      </BackgroundLines>
    </>
  );
}
