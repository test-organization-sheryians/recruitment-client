"use client"

import { CiMail } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import LabelInput from "./LabelInput";
import { useForm } from "react-hook-form";
import axios from "@/config/axios";

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupForm = () => {

  const { register, handleSubmit } = useForm<SignupFormData>()

  const onSubmit = (data: SignupFormData) => {
    axios.post(`/api/auth/register`, {
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword
    })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  return (
    <div className="w-full h-full font-[satoshi] bg-white rounded-2xl py-10 px-[20%] flex flex-col justify-center">
      <h1 className="text-3xl font-semibold text-center text-gray-800">
        Sign-up Account
      </h1>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <LabelInput
          label="Email"
          placeholder="your email"
          type="email"
          id="email"
          {...register("email")}
        />

        {/* Password */}
        <LabelInput
          label="Password"
          placeholder="8+ characters"
          type="password"
          id="password"
          {...register("password")}
        />

        <LabelInput
          label="Confirm Password"
          placeholder="8+ characters"
          type="password"
          id="confirmPassword"
          {...register("confirmPassword")}
        />

        {/* Continue Button */}
        <button className="w-full bg-[#4C62ED] hover:bg-[#3a4cd1] transition-colors text-white text-base font-medium rounded-base py-2.5 capitalize flex items-center justify-center gap-2 cursor-pointer"
          type="submit">
          <CiMail className="text-lg" /> Continue with Email
        </button>

        {/* Divider */}
        <div className="flex items-center justify-center my-4">
          <span className="flex-1 border-t border-gray-300"></span>
          <span className="mx-3 text-gray-400 text-xs font-medium">OR</span>
          <span className="flex-1 border-t border-gray-300"></span>
        </div>

        {/* Google Button */}
        <button className="w-full bg-[#3B3A3A] hover:bg-black transition-colors text-white text-base font-medium rounded-base py-2.5 capitalize flex items-center justify-center gap-2 cursor-pointer">
          <FcGoogle className="text-lg" /> Continue with Google
        </button>
      </form>

      {/* Register */}
      <p className="text-center text-gray-600 text-sm mt-6">
        Already a user?{" "}
        <a
          href="/login"
          className="text-[#4C62ED] underline font-medium"
        >
          Sign In
        </a>
      </p>
    </div>
  );
};

export default SignupForm;
