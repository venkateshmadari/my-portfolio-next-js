import React from "react";
import { motion } from "framer-motion";
import { sora_font } from "../preloader/Preloader";
import Image from "next/image";

import css from "@/public/css-icon.svg";
import next from "@/public/nextjs-icon.svg";
import typescript from "@/public/typescript-programming-language-icon.svg";
import react from "@/public/react-js-icon.svg";
import js from "@/public/javascript-programming-language-icon.svg";
import html from "@/public/html-icon.svg";
import tailwind from "@/public/tailwind-css-icon.svg";
import cpp from "@/public/c-plus-plus-programming-language-icon.svg";
import github from "@/public/github-icon.svg";
import mysql from "@/public/mysql-icon.svg";
import mongodb from "@/public/mongodb-svgrepo-com.svg";
import nodejs from "@/public/node-js-icon.svg";
import vercel from "@/app/favicon.ico";
import git from "@/public/git-icon.svg";
import bootstrap from "@/public/bootstrap-5-logo-icon.svg";


const skills = [
  { name: "Next.js", icon: next },
  { name: "TypeScript", icon: typescript },
  { name: "React", icon: react },
  { name: "JavaScript", icon: js },
  { name: "Tailwind", icon: tailwind },
  { name: "HTML", icon: html },
  { name: "CSS", icon: css },
  { name: "Bootstrap", icon: bootstrap },
  { name: "Git", icon: git },
  { name: "GitHub", icon: github },
  { name: "C++", icon: cpp },
  { name: "MySQL", icon: mysql },
  { name: "MongoDB", icon: mongodb },
  { name: "Node.js", icon: nodejs },
  { name: "Vercel", icon: vercel },
];

// Animation variants for the skill cards
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const SkillsGrid = () => {
  return (
    <div className={`${sora_font.className} px-4 pt-5`}>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {skills.map((skill, index) => (
          <>
            <motion.div
              key={index}
              variants={cardVariants}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="h-[120px] w-[150px] p-2 flex flex-col gap-2 items-center justify-center rounded-lg border dark:bg-gray-800 bg-slate-100"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Image
                  src={skill.icon}
                  height={40}
                  width={40}
                  alt={skill.name}
                  className="object-contain"
                />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`text-center mb-2 dark:text-white text-black ${sora_font.className}`}
              >
                {skill.name}
              </motion.p>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center mb-2 dark:text-white text-black hidden sm:block"
            >
              {}
            </motion.p>
          </>
        ))}
      </motion.div>
      <div className="flex items-center justify-center gap-4 flex-col">

 
      </div>
    </div>
  );
};

export default SkillsGrid;
