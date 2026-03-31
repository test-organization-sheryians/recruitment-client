import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-5">
      <h2 className="text-3xl font-semibold text-center underline">
        Products Page
      </h2>
      {children}
    </div>
  );
};

export default layout;
