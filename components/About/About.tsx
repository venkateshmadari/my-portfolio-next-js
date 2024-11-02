import {Forum } from "next/font/google";
import { Heading } from "../Home/Heading";

const forum_font = Forum({
  subsets: ["latin"],
  weight: ["400"],
});
export default function About() {
  return (
    <section
      className={` flex items-center justify-center w-full dark:bg-black bg-white  flex-col`}
    >
      <Heading heading={"Who am i ?"} />
      <p
        className={`md:max-w-4xl px-8 text-center  dark:text-white text-black text-base md:text-3xl leading-relaxed py-6  ${forum_font.className}`}
      >
        I am a{" "}
        <strong
          className={`text-shade  font-bold ${forum_font.className}`}
          style={{ letterSpacing: "1px" }}
        >
          Front-End web Developer & Designer
        </strong>{" "}
        who takes great pleasure in conceptualizing and bringing to life
        visually stunning products. I am always eager to broaden my horizons and
        acquire new skills that allow me to work more efficiently.
      </p>
    </section>
  );
}
