import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

export function TimelineDemo() {
  const data = [
    {
      title: "May 2024 - Present",
      content: (
        <div className="flex items-start justify-start flex-col ">
          <p className="text-black dark:text-white text-2xl font-normal mb-8">
            {" "}
            Currently shaping digital experiences as a{" "}
            <span className="text-shade capitalize">
              front-end web developer
            </span>{" "}
            at <Link href={"https://www.spackdigi.com/"}>Spack Solutions</Link>
          </p>{" "}
          <p className="text-neutral-800 dark:text-neutral-200 text-base font-normal mb-8">
            {" "}
            Passionate about bridging the gap between design and development, I
            lead the front-end lifecycle—from pixel-perfect design
            implementation to seamless backend integration—bringing intuitive
            and visually compelling solutions to life.{" "}
          </p>
          <div className="h-[280px] md:h-[350px] aspect-square flex items-start justify-start">
            <Image
              src="/code-img.png"
              alt="hero template"
              width={500}
              height={500}
              className="rounded-lg h-full object-contain  w-full items-start "
            />
          </div>
        </div>
      ),
    },
    {
      title: "2021 - 2024",
      content: (
        <div>
          <p className="text-black dark:text-white text-2xl font-normal mb-8">
            Graduated in 2024 with a{" "}
            <span className="text-shade capitalize">Bachelor's Degree</span> in
            ECE
          </p>
          <p className="text-black dark:text-white text-base font-normal mb-8">
            I bring a solid foundation in cutting-edge technology and analytical
            skills. This engineering background equips me with a unique
            perspective to tackle challenges, bridging the technical and
            creative worlds seamlessly in front-end web development and design.
          </p>
        </div>
      ),
    },
    {
      title: "< 2018",
      content: (
        <div>
          <p className="text-black dark:text-white text-2xl font-normal mb-8">
            Hands-On Experience through Internship
            <span className="text-shade capitalize"> & </span>
            Celebrating My Diploma Achievement
          </p>
          <div className="mb-8">
            <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            <FaStar className="text-shade" />
            Completed my 6 months+ intership at CITD, Hyderabad
            </div>
            <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            <FaStar className="text-shade" />
            Achieved My Diploma in GMR Poltechnic, Gajwel
            </div>
            <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            <FaStar className="text-shade" />
            Schooling at Z.P.H.S , Mahabubabad
            </div>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}
