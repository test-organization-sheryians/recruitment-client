"use client";

import { CiMail } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
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
  const safeRedirect =
    redirect && redirect.startsWith("/") ? redirect : null;

  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, watch } = useForm<{
    email: string;
    password: string;
  }>();

  const passwordValue = watch("password");

  const { mutate: loginUser, isPending: isLoggingIn, error } = useLogin();

  const onSubmit = (formData: { email: string; password: string }) => {
    setErrorMsg("");

    const sendData = new FormData();
    sendData.append("email", formData.email);
    sendData.append("password", formData.password);

    loginUser(sendData, {
      onSuccess: (res: any) => {
        Cookies.set("access", res.data.token);
        Cookies.set("role", res.data.user?.role?.name || "user");

        dispatch(
          setUser({
            id: res.data.user._id,
            email: res.data.user.email,
            firstName: res.data.user.firstName,
            lastName: res.data.user.lastName,
            role: res.data.user?.role?.name || "user",
            isVerified: res.data.user.isVerified,
          })
        );

        if (res.data.user?.role?.name === "admin") {
          router.push(safeRedirect || "/admin");
        } else {
          router.push(safeRedirect || "/");
        }
      },

      onError: (err: any) => {
        setErrorMsg(
          err?.response?.data?.message ||
            err?.message ||
            "Invalid email or password. Please try again."
        );
      },
    });
  };

  return (
    <div
      className="w-full min-h-full bg-white rounded-2xl font-[satoshi]
      md:py-10 py-6 md:px-[20%] px-[6%]
      flex flex-col justify-center"
    >
      <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 md:mb-8 mb-5 mt-2">
        Sign in to Your Account
      </h1>

      {(errorMsg || error) && (
        <div className="flex items-start gap-3 bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-200 mb-2">
          <AlertCircle size={20} className="mt-0.5" />
          <p className="text-sm font-medium leading-relaxed">
            {errorMsg || "Something went wrong. Please try again."}
          </p>
        </div>
      )}

      <form
        className="md:mt-8 mt-5 space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <LabelInput
          label="Email"
          placeholder="your email"
          type="email"
          {...register("email", { required: true })}
        />

        {/* Password */}
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
            onClick={() => setShowPassword((prev) => !prev)}
            className={`absolute right-4 top-[42px] md:top-[44px] transition-colors
              ${
                passwordValue
                  ? "text-gray-500 hover:text-gray-700"
                  : "text-gray-300 cursor-not-allowed"
              }`}
          >
            {showPassword ? (
              <FiEyeOff size={18} />
            ) : (
              <FiEye size={18} />
            )}
          </button>
        </div>

        <p className="text-right -mt-4">
          <a
            href="/forgot-password"
            className="text-sm text-[#4C62ED] hover:underline font-medium"
          >
            Forgot Password?
          </a>
        </p>

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full bg-[#4C62ED] hover:bg-[#3a4cd1]
            transition-all text-white font-medium rounded-base py-3
            flex items-center justify-center gap-2
            disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? (
            "Signing in..."
          ) : (
            <>
              <CiMail className="text-lg" />
              Continue with Email
            </>
          )}
        </button>

        <div className="flex items-center justify-center my-6">
          <span className="flex-1 border-t border-gray-300" />
          <span className="mx-4 text-gray-400 text-xs font-medium">OR</span>
          <span className="flex-1 border-t border-gray-300" />
        </div>

        <button
          type="button"
          className="w-full bg-[#3B3A3A] hover:bg-black
            transition-colors text-white font-medium rounded-base py-3
            flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>
      </form>

      <p className="text-center text-gray-600 text-sm mt-8 mb-2">
        Don’t have an account?{" "}
        <a
          href="/register"
          className="text-[#4C62ED] underline font-medium hover:text-[#3a4cd1]"
        >
          Register
        </a>
      </p>
    </div>
  );
};

export default SigninForm;
