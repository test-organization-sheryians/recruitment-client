"use client";

import { useRef } from "react";
import { MdOutlineMarkEmailRead } from "react-icons/md";

const VerifyEmail = () => {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // allow only numbers
    e.target.value = value;

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="w-full h-full font-[satoshi] bg-white rounded-2xl py-10 px-[20%] flex flex-col justify-center">
      <h1 className="text-3xl font-semibold text-center text-gray-800">
        Verify Your Email
      </h1>

      <p className="text-center pt-12 text-gray-700">
        An email with the verification code has been sent to your email
      </p>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-3 mt-8">
        {[0, 1, 2, 3].map((i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="w-12 h-12 text-2xl text-center rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ref={(el) => {
              if (el) inputsRef.current[i] = el;
            }}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
        ))}
      </div>

      {/* Resend link */}
      <p className="text-center mt-6 text-sm text-gray-600">
        Didn’t receive a code?{" "}
        <a href="#" className="text-blue-500 hover:underline">
          Request Again
        </a>
      </p>

      {/* Verify button */}
      <button className="mt-6 w-full bg-[#4C62ED] hover:bg-[#3a4cd1] transition-colors text-white text-base font-medium rounded-base py-2.5 capitalize flex items-center justify-center gap-2 cursor-pointer">
        <MdOutlineMarkEmailRead /> Verify Your Email
      </button>
    </div>
  );
};

export default VerifyEmail;
