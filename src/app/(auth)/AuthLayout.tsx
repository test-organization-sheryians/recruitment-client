import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageUrl: string;
}

const AuthLayout = ({ children, imageUrl }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-[#DCDCDC]
      flex gap-3.5 md:p-5 p-3 font-[satoshi]
      overflow-y-auto">

      {/* Form Section */}
      <div className="bg-white md:w-1/3 w-full rounded-base overflow-visible">
        {children}
      </div>

      {/* Image Section */}
      <div
        className="w-2/3 md:block hidden rounded-base bg-center bg-cover"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
    </div>
  );
};

export default AuthLayout;
