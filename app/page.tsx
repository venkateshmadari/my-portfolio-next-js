import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import GithubActivity from "@/components/GithubActivity";

import VisitorCounter from "@/components/ga4/VisitorCounter";
import HomeBlogs from "@/components/HomeBlogs";

export default function Page() {
  return (
    <>
      <main
        className="mx-auto w-full min-w-0 max-w-[720px] overflow-x-clip border-x border-white/10"
        id="home"
      >
        <Hero />
        <Experience />
        <HomeBlogs/>
        <TechStack />
        <Projects />
        <Education />
        <GithubActivity />
        <VisitorCounter />
      </main>
    </>
  );
}
