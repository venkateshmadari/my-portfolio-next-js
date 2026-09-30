export default function Section({ id, title, right, children }: { id?: string; title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="border-b border-white/10">
      <div className="hatch h-6 border-b border-white/10" />
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 sm:px-6">
        <h2 className="font-serif text-[22px] leading-none text-white">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}
