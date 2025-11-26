import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageUrl: string;
}

const AuthLayout = ({ children, imageUrl }: AuthLayoutProps) => {
  return (
    <div className="h-screen w-full bg-[#DCDCDC] overflow-hidden flex gap-3.5 p-5 font-[satoshi]">
      <div className="bg-white w-1/3 rounded-base overflow-hidden">
        {children}
      </div>
      <div
        className="w-2/3 rounded-base bg-center bg-cover overflow-hidden"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
    </div>
  );
};

export default AuthLayout;

