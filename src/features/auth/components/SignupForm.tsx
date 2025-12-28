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
            isVerified: boolean;
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
            isVerified: res.data.user.isVerified,
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
    <div className="w-full min-h-full bg-white rounded-2xl font-[satoshi] md:py-4 py-3 md:px-[4%] px-[3%] flex flex-col justify-center">
      <h1
  className="
    font-bold
    text-center
    text-gray-800
    whitespace-nowrap
    mb-1 xs:mb-2 sm:mb-3 md:mb-4
    text-[clamp(1rem,3vw,2rem)]
  "
>
  Sign-up Account
</h1>


      <form className="mt-1 space-y-2 " onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex flex-row gap-3">
          <div className="w-1/2">
            <LabelInput
              label="First Name"
              placeholder="your first name"
              type="text"
              {...register("firstName", { required: true })}
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
            onClick={() => setShowPassword((p) => !p)}
            className={`absolute right-4 top-[42px] md:top-[44px]
              ${
                passwordValue
                  ? "text-gray-500 hover:text-gray-700"
                  : "text-gray-300 cursor-not-allowed"
              }`}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        {(isError || serverError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg text-[10px]">
            {serverError || error?.message || "Something went wrong"}
          </div>
        )}

        {isSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg   text-[10px] ">
            Account created! Redirecting...
          </div>
        )}
        
        

        <button
          type="submit"
          disabled={isRegistering}
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
          {isRegistering ? (
            <span className="w-full text-center text-xs xs:text-sm sm:text-base">Creating Account...</span>
          ) : (
            <>
              <CiMail className="text-base xs:text-lg md:text-xl" />
              <span className="truncate text-sm xs:text-base md:text-[16px]">Continue with Email</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center my-2">
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
            py-1 sm:py-1.5 md:py-2
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

      <p className="text-center text-gray-600 text-sm mt-3 mb-2">
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
