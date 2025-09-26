import React from "react";

const Input = (
  { type, className, ...props }: { type: string; className: string },
  ref: React.Ref<HTMLInputElement>
) => {
  return <input {...props} type={type} className={` ${className}`} ref={ref} />;
};

export default React.forwardRef(Input);
