"use client";
import { CiMail } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import LabelInput from "./LabelInput";
import { useForm } from "react-hook-form";
import axios from "@/config/axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "../slice";
import { useMutation } from "@tanstack/react-query";

const SignupForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();

  
  const registerMutation = useMutation({
    mutationFn: (data: any) =>
      axios.post(`/api/auth/register`, {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        password: data.password,
      }),

    onSuccess: (res) => {
      Cookies.set("access", res.data.data.token);
      dispatch(setUser(res.data.data.user));
      router.push("/resume");
    },

    onError: (err) => {
      console.log("Error:", err);
    },
  });

  const onSubmit = (data: any) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="w-full h-full font-[satoshi] bg-white rounded-2xl py-5 px-[20%] flex flex-col justify-center">
      <h1 className="text-3xl font-semibold text-center text-gray-800">
        Sign-up Account
      </h1>

      <form className="mt-5 space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <LabelInput
          label="First Name"
          placeholder="your first name"
          type="text"
          {...register("firstName")}
        />

        <LabelInput
          label="Last Name"
          placeholder="your last name"
          type="text"
          {...register("lastName")}
        />

        <LabelInput
          label="Phone Number"
          placeholder="your phone number"
          type="number"
          {...register("phoneNumber")}
        />

        <LabelInput
          label="Email"
          placeholder="your email"
          type="email"
          {...register("email")}
        />

        <LabelInput
          label="Password"
          placeholder="8+ characters"
          type="password"
          {...register("password")}
        />

        {/* Continue Button */}
        <button
          className="w-full bg-[#4C62ED] hover:bg-[#3A4CD1] transition-colors text-white text-base font-medium rounded-base py-2.5 capitalize flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400"
          type="submit"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Processing..." : <CiMail className="text-lg" />}
          Continue with Email
        </button>

        <div className="flex items-center justify-center my-4">
          <span className="flex-1 border-t border-gray-300"></span>
          <span className="mx-3 text-gray-400 text-xs font-medium">OR</span>
          <span className="flex-1 border-t border-gray-300"></span>
        </div>

        <button className="w-full bg-[#3B3A3A] hover:bg-black transition-colors text-white text-base font-medium rounded-base py-2.5 capitalize flex items-center justify-center gap-2 cursor-pointer">
          <FcGoogle className="text-lg" /> Continue with Google
        </button>
      </form>

      <p className="text-center text-gray-600 text-sm mt-6">
        Already a user?{" "}
        <a href="/login" className="text-[#4C62ED] underline font-medium">
          Sign In
        </a>
      </p>
    </div>
  );
};

export default SignupForm;
