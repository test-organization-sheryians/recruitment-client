"use client";

import LabelInput from "./LabelInput";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setUser } from "../slice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRegister } from "../hooks/useAuthApi";
import { FiEye, FiEyeOff } from "react-icons/fi";

const SignupForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>();

  const passwordValue = watch("password");
  const [showPassword, setShowPassword] = useState(false);

  const {
    mutate: registerUser,
    isPending: isRegistering,
  } = useRegister();

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = (data: any) => {
    setServerError(null);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    registerUser(formData, {
      onSuccess: (res: any) => {
        dispatch(setUser(res.data.user));
        router.push("/un-verified");
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message?.toLowerCase();

        if (msg?.includes("exist")) {
          setServerError("Email already registered");
        } else {
          setServerError(msg || "Registration failed");
        }
      },
    });
  };

  return (
     <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
      
      <h1 className="font-bold text-center text-gray-800 whitespace-nowrap mb-2 xs:mb-3 sm:mb-4 md:mb-5 text-[clamp(1.7rem,2vw,2rem)]">
        Sign-up Account
      </h1>

      <form className="mt-1 space-y-2" onSubmit={handleSubmit(onSubmit)}>

        <div className="w-full flex flex-row gap-3">
          <div className="w-1/2">
            <LabelInput
              label="First Name"
              placeholder="your first name"
              type="text"
              error={errors.firstName?.message?.toString()}
              {...register("firstName", {
                required: "First name is required",
              })}
            />
          </div>

          <div className="w-1/2">
            <LabelInput
              label="Last Name"
              placeholder="your last name"
              type="text"
              {...register("lastName")}
            />
          </div>
        </div>

        <LabelInput
          label="Phone Number"
          placeholder="your phone number"
          type="text"
          error={errors.phoneNumber?.message?.toString()}
          {...register("phoneNumber", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Enter valid 10 digit number",
            },
          })}
        />

        <LabelInput
          label="Email"
          placeholder="your email"
          type="email"
          error={errors.email?.message?.toString()}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter valid email",
            },
          })}
        />

        <div className="relative">
          <LabelInput
            label="Password"
            placeholder="8+ characters"
            type={showPassword && passwordValue ? "text" : "password"}
            error={errors.password?.message?.toString()}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters required",
              },
            })}
          />

          <button
            type="button"
            disabled={!passwordValue}
            onClick={() => setShowPassword((p) => !p)}
            className={`absolute right-3 top-[69%] -translate-y-1/2 ${
              passwordValue
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg text-[10px]">
            {serverError}
          </div>
        )}

        <button type="submit" disabled={isRegistering} className="w-full bg-[#4C62ED] mt-3 text-white py-2">
          {isRegistering ? "Creating Account..." : "Continue with Email"}
        </button>
      </form>

      <p className="text-center text-gray-600 text-sm mt-3 mb-2">
        Already a user?{" "}
        <a href="/login" className="text-[#4C62ED] underline font-medium">
          Sign In
        </a>
      </p>
    </div>

    </div>
  );
};

export default SignupForm;