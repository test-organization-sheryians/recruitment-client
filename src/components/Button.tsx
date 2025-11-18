import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
  className?: string;
}

// You can modify styles as needed
export default function Button({
  children,
  variant = "solid",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "px-4 py-2 rounded-md font-medium transition",
        variant === "outline"
          ? "border border-[#1270B0] text-[#1270B0] bg-white"
          : "bg-[#1270B0] text-white",
        className
      )}
    >
      {children}
    </button>
  );
}
