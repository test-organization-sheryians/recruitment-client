import React from "react";
import AuthLayout from "../AuthLayout";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthLayout imageUrl="/images/signimg2.webp">{children}</AuthLayout>;
};

export default layout;
