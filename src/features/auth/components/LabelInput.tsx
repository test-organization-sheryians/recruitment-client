"use client";
import React from "react";

type Props = {
  label: string;
  type?: string;
  placeholder?: string;
  error?: any; // ✅ FIXED (was string before)
} & React.InputHTMLAttributes<HTMLInputElement>;

const LabelInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, type = "text", placeholder, error, className = "", ...rest }, ref) => {

    // ✅ ONLY LOGIC ADDED
    const errorMessage =
      typeof error === "string"
        ? error
        : error?.message
        ? error.message
        : "";

    return (
      <div className="flex flex-col gap-1 w-full"> {/* ✅ SAME layout */}

        {/* ✅ SAME label */}
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>

        {/* ✅ SAME input (only border color condition added) */}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          {...rest}
          className={`border rounded-lg px-3 py-2 outline-none shadow-sm 
            ${errorMessage ? "border-red-500" : "border-gray-300"} 
            ${className}
          `}
        />

        {/* ✅ SAME error position */}
        {errorMessage && (
          <p className="text-red-500 text-xs mt-1">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

LabelInput.displayName = "LabelInput";
export default LabelInput;