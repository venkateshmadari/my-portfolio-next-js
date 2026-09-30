import LetsTalk from "./LetsTalk";
import LocationTime from "./LocationTime";
import Section from "./Section";
export default function Closing() {
  return (
    <>
      <Section title="Scrolled Too Far" right={null}>
        <p className="pb-4 pt-8 text-center text-[11px] text-neutral-300">
          If you've read this far, you might be interested in collaborating or
          building something great.
        </p>
        <div className="flex justify-center pb-10">
          <LetsTalk />
        </div>
      </Section>
      <footer className="border-b border-white/10 py-10 text-center text-[11px] text-neutral-400">
        <p>
          Designed & Developed by <b className="text-white">Venkatesh Madari</b>
        </p>
        <p className="mt-1 font-mono text-[9px] text-neutral-400">
          © 2026 All rights reserved.
        </p>
        <LocationTime />
      </footer>
    </>
  );
}
