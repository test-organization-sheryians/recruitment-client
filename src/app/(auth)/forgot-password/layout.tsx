import React from "react";
import AuthLayout from "../AuthLayout";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthLayout imageUrl="/images/forgotpass.png">{children}</AuthLayout>;
};

export default layout;
