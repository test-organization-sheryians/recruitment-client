import React from "react";
import Navbar from "@/components/Navbar";
import SideBar from "@/features/dashboard/components/SideBar";

interface AITestLayoutProps {
  children: React.ReactNode;
}

const AITestLayout = ({ children }: AITestLayoutProps) => {
  return (
    <div
      suppressHydrationWarning={true}
      className="w-full h-screen bg-zinc-400 p-3 grid grid-rows-[auto_1fr]"
    >
      <header className=" bg-white rounded-lg">
        <Navbar />
      </header>  

      <div className="bg-white rounded-lg mt-3 overflow-y-auto">{children}</div>
    </div>
  );
};

export default AITestLayout;
