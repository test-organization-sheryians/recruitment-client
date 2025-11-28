import React from "react";

const Button = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
}) => {
  return (
    <button {...props} className={` ${className}`}>
      {children}
    </button>
  );
};

export default Button;
