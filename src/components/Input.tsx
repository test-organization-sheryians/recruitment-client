import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  type?: string;
};

const Input = (
  { type = "text", className = "", ...props }: InputProps,
  ref: React.Ref<HTMLInputElement>
) => {
  return <input {...props} type={type} className={`${className}`} ref={ref} />;
};

export default React.forwardRef<HTMLInputElement, InputProps>(Input);
