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

interface SignupFormData {
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  email: string;
  password: string;
}

interface RegisterSuccessResponse {
  data: {
    token: string;
    user: {
      _id: string;
      email: string;
      firstName: string;
      lastName?: string;
      role?: {
        name: string;
      };
    };
  };
}

const SignupForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    mode: "onTouched",
  });

  // We don't use `error` from react-query here (we handle it manually), so remove it
  const { mutate: registerUser, isPending: isRegistering, isError, isSuccess } = useRegister();

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    if (data.lastName) formData.append("lastName", data.lastName);
    if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
    formData.append("email", data.email);
    formData.append("password", data.password);

    registerUser(formData, {
      onSuccess: (res: RegisterSuccessResponse) => {
        Cookies.set("access", res.data.token, { expires: 7, secure: true, sameSite: "strict" });

        const rawRole = res.data.user.role?.name;
        const role =
          rawRole === "admin" || rawRole === "candidate" || rawRole === "user"
            ? (rawRole as "admin" | "candidate" | "user")
            : "user";

        dispatch(
          setUser({
            id: res.data.user._id,
            email: res.data.user.email,
            firstName: res.data.user.firstName,
            lastName: res.data.user.lastName || "",
            role,
          })
        );

        router.push("/candidate/resume");
      },
      onError: (error: unknown) => {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };

        const message =
          err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again later.";

        setServerError(message);
      },
    });
  };

  return (
    <div className="w-full h-full font-[satoshi] bg-white rounded-2xl py-8 px-[15%] lg:px-[20%] flex flex-col justify-center">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Create Your Account
      </h1>

      {(isError || serverError) && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
          <span>Warning</span>
          {serverError || "Unable to create account. Please try again."}
        </div>
      )}

      {isSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">
          Account created successfully! Redirecting...
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Your inputs remain exactly the same */}
        <LabelInput
          label="First Name"
          placeholder="John"
          type="text"
          {...register("firstName", {
            required: "First name is required",
            minLength: { value: 2, message: "Too short" },
          })}
        />
        {errors.firstName && <p className="text-red-600 text-xs -mt-2 pl-1">{errors.firstName.message}</p>}

        <LabelInput label="Last Name" placeholder="Doe (optional)" type="text" {...register("lastName")} />
        <LabelInput label="Phone Number" placeholder="+91 98765 43210 (optional)" type="tel" {...register("phoneNumber")} />

        <LabelInput
          label="Email"
          placeholder="you@example.com"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && <p className="text-red-600 text-xs -mt-2 pl-1">{errors.email.message}</p>}

        <LabelInput
          label="Password"
          placeholder="Create a strong password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          })}
        />
        {errors.password && <p className="text-red-600 text-xs -mt-2 pl-1">{errors.password.message}</p>}

        <button
          type="submit"
          disabled={isRegistering || isSubmitting}
          className="w-full bg-[#4C62ED] hover:bg-[#3a4ed1] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-white font-semibold rounded-lg py-3.5 flex items-center justify-center gap-2 shadow-md"
        >
          {isRegistering ? "Creating Account..." : (
            <>
              <CiMail className="text-xl" />
              Continue with Email
            </>
          )}
        </button>

        <div className="flex items-center justify-center my-6">
          <span className="flex-1 border-t border-gray-300"></span>
          <span className="mx-4 text-gray-500 text-xs font-medium bg-white px-2">OR</span>
          <span className="flex-1 border-t border-gray-300"></span>
        </div>

        <button type="button" className="w-full bg-gray-900 hover:bg-black transition-colors text-white font-medium rounded-lg py-3.5 flex items-center justify-center gap-2 shadow-md">
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>
      </form>

      <p className="text-center text-gray-600 text-sm mt-10">
        Already have an account?{" "}
        <a href="/login" className="text-[#4C62ED] font-semibold hover:underline">
          Sign In
        </a>
      </p>
    </div>
  );
};

export default SignupForm;