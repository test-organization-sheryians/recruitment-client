"use client";

import { CiMail } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import LabelInput from "./LabelInput";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "../slice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRegister } from "../hooks/useAuthApi";

const SignupForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm<{
    firstName: string;
    lastName?: string;
    phoneNumber?: string;
    email: string;
    password: string;
  }>();

  // This is the clean, modern way
  const {
    mutate: registerUser,
    isPending: isRegistering,
    isError,
    error,
    isSuccess,
  } = useRegister();

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = (data: {
    firstName: string;
    lastName?: string;
    phoneNumber?: string;
    email: string;
    password: string;
  }) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    if (data.lastName) formData.append("lastName", data.lastName);
    if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
    formData.append("email", data.email);
    formData.append("password", data.password);

    registerUser(formData, {
      onSuccess: (res: {
        data: {
          token: string;
          user: {
            _id: string;
            email?: string;
            firstName: string;
            lastName?: string;
            role?: { name: string };
          };
        };
      }) => {
        Cookies.set("access", res.data.token);

        dispatch(
          setUser({
            id: res.data.user._id,
            firstName: res.data.user.firstName,
            role: res.data.user?.role?.name || "user",
          })
        );
        router.push("/candidate/resume");
      },
      onError: (err: {
        response?: { data?: { message: string } };
        message: string;
      }) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Registration failed. Please try again.";
        setServerError(message);
      },
    });
  };

  return (
    <div className="w-full h-full font-[satoshi] bg-white rounded-2xl py-5 px-6 md:px-[20%] flex flex-col justify-center">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-10 md:mb-6">
        Sign-up Account
      </h1>

      <form className="mt-8 md:mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <LabelInput
          label="First Name"
          placeholder="your first name"
          type="text"
          {...register("firstName", { required: true })}
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
          type="text"
          {...register("phoneNumber")}
        />
        <LabelInput
          label="Email"
          placeholder="your email"
          type="email"
          {...register("email", { required: true })}
        />
        <LabelInput
          label="Password"
          placeholder="8+ characters"
          type="password"
          {...register("password", { required: true })}
        />

        {(isError || serverError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {serverError || error?.message || "Something went wrong"}
          </div>
        )}

        {isSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Account created! Redirecting...
          </div>
        )}

        <button
          type="submit"
          disabled={isRegistering}
          className="w-full bg-[#4C62ED] hover:bg-[#3A4CD1] transition-all text-white font-medium rounded-base py-3 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isRegistering ? (
            "Creating Account..."
          ) : (
            <>
              <CiMail className="text-lg" />
              Continue with Email
            </>
          )}
        </button>

        <div className="flex items-center justify-center my-6">
          <span className="flex-1 border-t border-gray-300"></span>
          <span className="mx-4 text-gray-400 text-xs font-medium">OR</span>
          <span className="flex-1 border-t border-gray-300"></span>
        </div>

        <button
          type="button"
          className="w-full bg-[#3B3A3A] hover:bg-black transition-colors text-white font-medium rounded-base py-3 flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>
      </form>

      <p className="text-center text-gray-600 text-sm mt-8">
        Already a user?{" "}
        <a
          href="/login"
          className="text-[#4C62ED] underline font-medium hover:text-[#3A4CD1]"
        >
          Sign In
        </a>
      </p>
    </div>
  );
};

export default SignupForm;
