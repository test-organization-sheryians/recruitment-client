"use client";

import { CiMail } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import LabelInput from "./LabelInput";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "../slice";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useLogin } from "../hooks/useAuthApi";

const SigninForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit } = useForm<{
    email: string;
    password: string;
  }>();

  const { mutate: loginUser, isPending: isLoggingIn, error } = useLogin();

  const onSubmit = (formData: { email: string; password: string }) => {
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
            email: string;
            firstName: string;
            lastName: string;
            role?: { name: string };
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
          })
        );
        if (
          res.data.user?.role?.name &&
          res.data.user?.role?.name === "admin"
        ) {
          router.push("/admin");
        } else {
          router.push("/candidate/resume");
        }
      },
      onError: (err: {
        response?: { data?: { message: string } };
        message: string;
      }) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Invalid email or password. Please try again.";
        setErrorMsg(message);
      },
    });
  };

  return (
    <div className="w-full h-full font-[satoshi] bg-white rounded-2xl py-10 px-[20%] flex flex-col justify-center">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Sign in to Your Account
      </h1>

      {(errorMsg || error) && (
        <div className="flex items-center gap-3 bg-red-50 text-red-700 px-5 py-3 rounded-lg border border-red-200">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">
            {errorMsg || "Something went wrong. Please try again."}
          </p>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
          className="w-full bg-[#4C62ED] hover:bg-[#3a4cd1] transition-all text-white font-medium rounded-base py-3 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
