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
import useAuthApi from "../hooks/useAuthApi";

const SigninForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit } = useForm();
  const { loginMutation } = useAuthApi();

  const onSubmit = (formData: any) => {
    const sendData = new FormData();
    sendData.append("email", formData.email);
    sendData.append("password", formData.password);

    loginMutation.mutate(
      { data: sendData, onProgress: () => {} },
      {
        onSuccess: (res: any) => {
          Cookies.set("access", res.data.token);
          const payload = {
            id: res.data.user._id,
            email: res.data.user.email,
            firstName: res.data.user.firstName,
            lastName: res.data.user.lastName,
            role: res.data.user?.role?.name,
          };
          dispatch(setUser(payload));
          router.push("/resume");
          setErrorMsg("");
        },

        onError: () => {
          setErrorMsg("Invalid email or password. Please try again.");
        },
      }
    );
  };

  return (
    <div className="w-full h-full font-[satoshi] bg-white rounded-2xl py-10 px-[20%] flex flex-col justify-center">
      <h1 className="text-3xl font-semibold text-center text-gray-800">
        Sign in to Your Account
      </h1>

      {/* ERROR BOX */}
      {errorMsg && (
        <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-md mt-4">
          <AlertCircle size={18} />
          <p className="text-sm">{errorMsg}</p>
        </div>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
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

        <p className="text-right -mt-3">
          <a
            href="/forgot-password"
            className="text-sm text-[#4C62ED] hover:underline font-medium"
          >
            Forgot Password?
          </a>
        </p>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-[#4C62ED] hover:bg-[#3a4cd1] transition-colors text-white text-base font-medium rounded-base py-2.5 capitalize flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400"
        >
          {loginMutation.isPending ? (
            "Signing in..."
          ) : (
            <CiMail className="text-lg" />
          )}
          Continue with Email
        </button>

        <div className="flex items-center justify-center my-4">
          <span className="flex-1 border-t border-gray-300"></span>
          <span className="mx-3 text-gray-400 text-xs font-medium">OR</span>
          <span className="flex-1 border-t border-gray-300"></span>
        </div>

        <button
          type="button"
          className="w-full bg-[#3B3A3A] hover:bg-black transition-colors text-white text-base font-medium rounded-base py-2.5 capitalize flex items-center justify-center gap-2 cursor-pointer"
        >
          <FcGoogle className="text-lg" /> Continue with Google
        </button>
      </form>

      <p className="text-center text-gray-600 text-sm mt-6">
        Don’t have an account?{" "}
        <a href="/register" className="text-[#4C62ED] underline font-medium">
          Register
        </a>
      </p>
    </div>
  );
};

export default SigninForm;
