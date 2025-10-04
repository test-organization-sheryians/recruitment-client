"use client"

import { CiMail } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import LabelInput from "./LabelInput";
import { useForm } from "react-hook-form";
import axios from "@/config/axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "../slice";

const SignupForm = () => {

  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    axios.post(`/api/auth/register`, {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      password: data.password,
      confirmPassword: data.confirmPassword
    })
    .then((res) => {
      Cookies.set("access", res.data.data.token);
      dispatch(setUser(res.data.data.user))
    })
    .catch((err) => {
      console.log(err)
    })
  }

  return (
    <div className="w-full h-full font-[satoshi] bg-white rounded-2xl py-[20%] px-[20%] flex flex-col justify-center">
      <h1 className="text-2xl font-semibold text-center text-gray-800">
        Sign-up Account
      </h1>

      <form className="mt-2 space-y-1" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <LabelInput
          label="Email"
          placeholder="your email"
          type="email"
          id="email"
          {...register("email")}
        />

        <div className="flex gap-5">
          <LabelInput
            label="FirstName"
            placeholder="first name"
            type="text"
            id="firstName"
          {...register("firstName")}
        />
        <LabelInput
          label="LastName"
          placeholder="last name"
          type="text"
          id="lastName"
          {...register("lastName")}
        />
        </div>

        <LabelInput
          label="Phone Number"
          placeholder="phone number"
          type="text"
          id="phoneNumber"
          {...register("phoneNumber")}
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
        <button className="w-full bg-[#4C62ED] hover:bg-[#3a4cd1] transition-colors text-white text-base font-medium rounded-base py-2 mt-2 capitalize flex items-center justify-center gap-2 cursor-pointer"
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
        <button className="w-full bg-[#3B3A3A] hover:bg-black transition-colors text-white text-base font-medium rounded-base py-2 capitalize flex items-center justify-center gap-2 cursor-pointer">
          <FcGoogle className="text-lg" /> Continue with Google
        </button>
      </form>

      {/* Register */}
      <p className="text-center text-gray-600 text-sm mt-3">
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
