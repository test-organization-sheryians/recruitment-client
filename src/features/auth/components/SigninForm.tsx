"use client";

import { CiMail } from "react-icons/ci";
import LabelInput from "./LabelInput";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "../slice";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useLogin } from "../hooks/useAuthApi";
import { FiEye, FiEyeOff } from "react-icons/fi";

const SigninForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect");
  const safeRedirect = redirect && redirect.startsWith("/") ? redirect : null;

  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>();

  const passwordValue = watch("password");

  const { mutate: loginUser, isPending } = useLogin();

  const onSubmit = (data: any) => {
    setErrorMsg("");

    // 🔴 FRONTEND VALIDATION
    if (!data.email && !data.password) {
      return setErrorMsg("Email and Password are required");
    }
    if (!data.email) {
      return setErrorMsg("Email is required");
    }
    if (!data.password) {
      return setErrorMsg("Password is required");
    }

    loginUser(data, {
      onSuccess: (res: any) => {
        dispatch(setUser(res.data.user));
        Cookies.set("role", res.data.user?.role?.name || "user");

        router.push(
          res.data.user?.role?.name === "admin"
            ? safeRedirect || "/admin"
            : safeRedirect || "/"
        );
      },

      onError: (err: any) => {
        const msg = err?.response?.data?.message?.toLowerCase();

        if (msg?.includes("not found") || msg?.includes("register")) {
          setErrorMsg("User not registered. Please register first.");
        } else if (msg?.includes("password")) {
          setErrorMsg("Incorrect password");
        } else if (msg?.includes("email")) {
          setErrorMsg("Invalid email");
        } else {
          setErrorMsg("Invalid email or password");
        }
      },
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6">

        <h1 className="text-2xl font-semibold text-center mb-4">
          Sign in to Your Account
        </h1>

        {(errorMsg || errors.email || errors.password) && (
          <div className="flex items-start gap-3 bg-red-50 text-red-700 px-3 py-2 rounded-lg border border-red-200 mb-2">
            <AlertCircle size={20} />
            <p className="text-[10px]">
              {errorMsg ||
                errors.email?.message?.toString() ||
                errors.password?.message?.toString()}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

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
              })}
            />

            <button
              type="button"
              disabled={!passwordValue}
              onClick={() => setShowPassword((prev) => !prev)}
              className={`absolute top-[58%] right-3 ${
                passwordValue
                  ? "text-gray-500"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <p className="text-right text-sm">
            <a href="/forgot-password" className="text-[#4C62ED] underline">
              Forgot Password?
            </a>
          </p>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#4C62ED] text-white py-2"
          >
            {isPending ? "Signing in..." : "Continue with Email"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-3">
          Don’t have an account?{" "}
          <a href="/register" className="text-[#4C62ED] underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default SigninForm;