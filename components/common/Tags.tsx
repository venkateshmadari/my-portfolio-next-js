const Tags = ({ name }: { name: string }) => {
  return (
    <span
      className="rounded tracking-wide font-medium cursor-pointer hover:bg-primary/10 hover:text-primary transition-all duration-200 ease-in-out border border-white/10 px-1.5 py-0.5 text-xs text-neutral-300"
    >
      {name}
    </span>
  );
};

export default Tags;
