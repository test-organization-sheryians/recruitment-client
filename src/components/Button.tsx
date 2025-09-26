import React from "react";

const Button = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <button {...props} className={` ${className}`}>
      {children}
    </button>
  );
};

export default Button;
