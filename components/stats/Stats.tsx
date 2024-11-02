import React from "react";
import { Heading } from "../Home/Heading";
import { useTheme } from "next-themes";

const Stats = () => {
  const { theme } = useTheme(); // Get current theme from useTheme()

  // Set the theme string for the images based on the Next.js theme value
  const imageTheme = theme === "dark" ? "dark" : "graywhite";

  return (
    <div className="flex items-center flex-col justify-center pb-16">
      <Heading heading={"My Stats"} />
      <div className="flex justify-center items-center p-4 w-full gap-4  md:flex-row flex-col-reverse">
        <img
          src={`https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=venkateshmadari&theme=${imageTheme}`}
          width={500}
          height={500}
          alt="GitHub Stats"
          className="max-w-full h-auto"
        />
        <img
          src={`https://github-readme-stats.vercel.app/api/top-langs?username=venkateshmadari&locale=en&hide_title=false&layout=compact&card_width=320&langs_count=5&theme=${imageTheme}&hide_border=true&order=2`}
          height="150"
          alt="Languages Graph"
        />
      </div>
      <div className="flex items-center justify-center w-full px-2">
        <img
          src={`https://streak-stats.demolab.com?user=venkateshmadari&locale=en&mode=daily&theme=${imageTheme}&hide_border=true&order=2`}
          height="220"
          alt="Streak Graph"
        />
      </div>
  
    </div>
  );
};

export default Stats;
