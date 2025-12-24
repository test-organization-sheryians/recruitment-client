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
import { FiEye, FiEyeOff } from "react-icons/fi";


const SignupForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { register, handleSubmit, watch } = useForm<{
    firstName: string;
    lastName?: string;
    phoneNumber?: string;
    email: string;
    password: string;
  }>();

  const passwordValue = watch("password");
  const [showPassword, setShowPassword] = useState(false);

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
            isVerified:boolean
          };
        };
      }) => {
        Cookies.set("access", res.data.token);
        dispatch(
          setUser({
           id: res.data.user._id,
            email: res.data.user.email,
            firstName: res.data.user.firstName,
            lastName: res.data.user.lastName,
            role: res.data.user?.role?.name || "user",
            isVerified:res.data.user.isVerified
          })
        );
        router.push("/un-verified");
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
    <div className="w-full h-full font-[satoshi] bg-white rounded-2xl py-5 md:px-[4%] px-[3%] flex flex-col justify-center">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-5 ">
        Sign-up Account
      </h1>

      <form className="md:mt-5 mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full flex items-center justify-between">
        <div className="w-[49%]">
          <LabelInput
            label="First Name"
            placeholder="your first name"
            type="text"
            //{...register("firstName", { required: true })}
          />
        </div>
        <div className="w-[49%]">
          <LabelInput
            label="Last Name"
            placeholder="your last name"
            type="text"
            // {...register("lastName")}
          />
        </div>
      </div>
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
        <div className="relative">
  <LabelInput
    label="Password"
    placeholder="8+ characters"
    type={showPassword && passwordValue ? "text" : "password"}
    {...register("password", { required: true })}
  />

  <button
    type="button"
    disabled={!passwordValue}
    onClick={() => {
      if (!passwordValue) return;
      setShowPassword((prev) => !prev);
    }}
    className={`absolute right-4 top-[42px] transition-colors
      ${
        passwordValue
          ? "text-gray-500 hover:text-gray-700"
          : "text-gray-300 cursor-not-allowed"
      }`}
  >
    {showPassword && passwordValue ? (
      <FiEyeOff size={18} />
    ) : (
      <FiEye size={18} />
    )}
  </button>
</div>


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
