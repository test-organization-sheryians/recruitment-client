"use client"

import React from "react";
import LabelInput from "./LabelInput";
import { useRouter } from "next/navigation";

const PasswordReset = () => {

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent)=>{
    e.preventDefault();
    //backend

    router.push("/PasswordResetOtpInput")
  }

  return (
    <div className="w-full h-full font-[satoshi] bg-white rounded-2xl py-10 px-[20%] flex flex-col justify-center">
      <h1 className="text-3xl font-semibold text-center text-gray-800">
        Password Reset
      </h1>
      <p className="text-center text-gray-600 text-sm mt-2">
        Please enter your email address to receive password reset instructions.
      </p>

      <form className="mt-8 space-y-5">
        {/* Email or Phone */}
        <LabelInput
          label="Email or phone"
          placeholder="Enter your email or phone number"
          type="text"
          id="emailOrPhone"
        />

        {/* Next Button */}
        <button
          type="submit"
          className="w-full bg-[#4C62ED] hover:bg-[#3a4cd1] transition-colors text-white text-base font-medium rounded-base py-2.5 capitalize flex items-center justify-center gap-2 cursor-pointer"
        >
          Next →
        </button>
      </form>
    </div>
  );
};

export default PasswordReset;
