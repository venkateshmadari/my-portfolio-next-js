import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[720px] overflow-x-clip border-x border-white/10">
      {children}
    </div>
  );
};

export default layout;
