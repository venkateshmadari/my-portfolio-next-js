"use client";
import About from "@/components/About/About";
import { BackgroundLinesDemo } from "@/components/Home/BackgroundLinesDemo";
import Divider from "@/components/Home/Divider";
import Footer from "@/components/Home/Footer";
import { Heading } from "@/components/Home/Heading";
import Projects from "@/components/Home/Projects";
import { TimelineDemo } from "@/components/Home/TimeLine";
import Scroller from "@/components/parallaxx/Scroller";
import Preloader from "@/components/preloader/Preloader";
import { Sidebar } from "@/components/sidebar";
import Stats from "@/components/stats/Stats";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      new LocomotiveScroll();

      setTimeout(() => {
        setIsLoading(false);
        document.body.style.cursor = "default";
        window.scrollTo(0, 0);
      }, 2000);
    };
    load();
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence>
      <div className="flex">
        {!isLoading && (
          <>
            <Sidebar />
            <main className="flex-1">
              <BackgroundLinesDemo />
              <Scroller />
              <About />
              <Divider />
              <div className="flex items-center justify-center">
                <Heading heading={" My Journey"} />
              </div>
              <TimelineDemo />
              <Stats />
              <Divider />
              <Projects />
              <Footer />
            </main>
            <Sidebar />
          </>
        )}
      </div>
    </>
  );
}
