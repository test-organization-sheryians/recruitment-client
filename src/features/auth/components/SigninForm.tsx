"use client"

import { CiMail } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import LabelInput from "./LabelInput";
import { useForm } from "react-hook-form";
import axios from "@/config/axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "../slice";
import { useRouter } from "next/navigation";

const SigninForm = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm()
  const router = useRouter();

  const onSubmit = (data: any) => {
    axios.post(`/api/auth/login`, {
      email: data.email,
      password: data.password
    })
      .then((res) => {
        Cookies.set("access", res.data.data.token);
        dispatch(setUser(res.data.data.user))
        router.push("/resume")
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="w-full h-full font-[satoshi] bg-white rounded-2xl py-10 px-[20%] flex flex-col justify-center">
      <h1 className="text-3xl font-semibold text-center text-gray-800">
        Sign in to Your Account
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

        {/* Forgot Password Link */}
        <p className="text-right -mt-3">
        <a
        href="/forgot-password"
        className="text-sm text-[#4C62ED] hover:underline font-medium"
        >
          Forgot Password?
        </a>
        </p>

        {/* Continue Button */}
        <button type="submit" className="w-full bg-[#4C62ED] hover:bg-[#3a4cd1] transition-colors text-white text-base font-medium rounded-base py-2.5 capitalize flex items-center justify-center gap-2 cursor-pointer">
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
        Don’t have an account?{" "}
        <a
          href="/register"
          className="text-[#4C62ED] underline font-medium"
        >
          Register
        </a>
      </p>
    </div>
  );
};

export default SigninForm;
