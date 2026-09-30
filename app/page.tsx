import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import GithubActivity from "@/components/GithubActivity";
import Closing from "@/components/Closing";

export default function Page() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full min-w-0 max-w-[720px] overflow-x-clip border-x border-white/10"  id="home">
        <Hero />
        <Experience />
        <TechStack />
        <Projects />
        <Education />
        <GithubActivity />
        <Closing />
      </main>
    </>
  );
}
