import { Sidebar } from "@/components/sidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar /> 
      <main className="flex-1 ">{children}</main>
    </div>
  );
};

export default Layout;
