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

type SigninFormData = {
  email: string;
  password: string;
};

const SigninForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect");
  const safeRedirect = redirect && redirect.startsWith("/") ? redirect : null;

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { register, handleSubmit, watch } = useForm<SigninFormData>();

  const passwordValue = watch("password");

  const { mutate: loginUser, isPending: isLoggingIn, error } = useLogin();

  const onSubmit = (formData: SigninFormData) => {
    setErrorMsg("");

    const sendData = new FormData();
    sendData.append("email", formData.email);
    sendData.append("password", formData.password);

    loginUser(sendData, {
      onSuccess: (res: {
        data: {
          token: string;
          user: {
            _id: string;
            email?: string;
            firstName: string;
            lastName?: string;
            role?: { name: string };
            isVerified: boolean;
          };
        };
      }) => {
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
      onError: (err: {
        response?: { data?: { message: string } };
        message?: string;
      }) => {
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
      className="
        w-full min-h-screen bg-white font-[satoshi] flex items-center justify-center px-4 sm:px-6 overflow-hidden
      "
    >
       <div
        className="w-full max-w-[480px] sm:max-w-[520px] bg-white rounded-2xl py-1 sm:py-3 md:py-5 px-4 sm:px-6 md:px-7"
      >
       <h1
          className="
            text-2xl sm:text-3xl
            font-semibold text-center text-gray-800
            mb-4 sm:mb-3 md:mb-5
          "
        >
          Sign in to Your Account
        </h1>

        {(errorMsg || error) && (
          <div className="flex items-start gap-3 bg-red-50 text-red-700 px-3 py-2 rounded-lg border border-red-200 mb-2">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <p className="text-[10px] font-medium leading-relaxed break-words mt-1">
              {errorMsg || "Something went wrong. Please try again."}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 w-full mt-4"
        >
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
              onClick={() => setShowPassword((prev) => !prev)}
              className={`
                absolute right-3 sm:right-4
                top-[40px] sm:top-[42px] md:top-[44px]
                transition-colors
                ${
                  passwordValue
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-gray-300 cursor-not-allowed"
                }
              `}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <p className="text-right text-sm">
            <a
              href="/forgot-password"
              className="text-[#4C62ED] hover:underline font-medium"
            >
              Forgot Password?
            </a>
          </p>

          <button
            type="submit"
            disabled={isLoggingIn}
            className={`
              w-full bg-[#4C62ED] mt-3 hover:bg-[#3A4CD1]
            transition-all text-white
            text-sm xs:text-base sm:text-base md:text-[17px] lg:text-lg
            font-medium rounded-base
            py-2 xs:py-3 sm:py-3 md:py-3
            flex items-center justify-center gap-1.5 xs:gap-2 md:gap-3
            px-2 sm:px-4 md:px-6
            min-h-[42px] xs:min-h-[46px] sm:min-h-[48px] md:min-h-[52px]
            max-w-full
            shadow-sm md:shadow
            disabled:bg-gray-400 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-[#4C62ED] focus:ring-offset-2
            `}
          >
            {isLoggingIn ? (
              <span className="w-full text-center text-xs xs:text-sm sm:text-base">Signing in...</span>
            ) : (
              <>
                <CiMail className="text-base xs:text-lg md:text-xl" />
                <span className="truncate text-sm xs:text-base md:text-[16px]">Continue with Email</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center my-3">
            <span className="flex-1 border-t border-gray-300" />
            <span className="mx-4 text-gray-400 text-xs font-medium">OR</span>
            <span className="flex-1 border-t border-gray-300" />
          </div>

          <button
            type="button"
            className={`
              w-full
              bg-[#3B3A3A] hover:bg-black
              transition-colors text-white
              text-sm sm:text-base md:text-[17px] lg:text-lg
              font-medium rounded-base
              py-3 sm:py-3.5 md:py-4
              flex items-center justify-center gap-2 md:gap-3
              px-2 sm:px-4 md:px-6
              min-h-[44px] sm:min-h-[48px] md:min-h-[52px]
              max-w-full
              shadow-sm md:shadow
              focus:outline-none focus:ring-2 focus:ring-[#4C62ED] focus:ring-offset-2
            `}
          >
            <FcGoogle className="text-xl md:text-2xl lg:text-3xl" />
            <span className="truncate">Continue with Google</span>
          </button>
        </form>

        <p
          className="
            text-center 
            text-gray-600 
            text-xs 
            xs:text-sm 
            sm:text-base 
            md:text-[15px] 
            lg:text-[16px] 
            mt-3 tracking-tight leading-4 
            xs:mt-5 
            px-2
          "
        >
          Don’t have an account?{" "}
          <a
            href="/register"
            className="
              text-[#4C62ED] 
              underline 
              font-medium 
              hover:text-[#3a4cd1]
              text-xs 
              xs:text-sm 
              sm:text-base 
              md:text-[15px] 
              lg:text-[16px]
              transition-colors
            "
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default SigninForm;
