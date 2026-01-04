"use client";
import { useState } from "react";
import axios from "axios";
import { useForgotPassword } from "../hooks/useForgotPasswordApi";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";


export default function ForgotPassword() {
  const toast = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");

  const {
    mutate,
    data,
    error,
    isPending,
    isError,
  } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  mutate(
    { email },
    {
      onSuccess: () => {
        toast.success("reset link has been sent");
        router.push("/login")
      },
      onError: (error: unknown) => {
        let message = "Failed to send reset password email"

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message
      }
        toast.error(message);
      },
    }
  );
};


  const errorMessage =
    isError && axios.isAxiosError(error)
      ? error.response?.data?.message
      : "Something went wrong";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2 sm:px-6">
      <div className="bg-white p-6 sm:p-8 rounded-lg sm:rounded-xl shadow-sm sm:shadow-md w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl transition-all duration-200">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">
          Forgot Password
        </h2>

        {/* SUCCESS MESSAGE */}
        {data?.message && (
          <div className="bg-green-100 text-green-800 p-2 sm:p-3 rounded mb-3 sm:mb-4 text-xs sm:text-sm">
            {data.message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {isError && (
          <div className="bg-red-100 text-red-800 p-2 sm:p-3 rounded mb-3 sm:mb-4 text-xs sm:text-sm">
            {errorMessage}
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          className="space-y-3 sm:space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium text-sm sm:text-base">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2 sm:p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm sm:text-base"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex w-full">
            <button
              type="submit"
              disabled={isPending}
              className={`
                flex-1
                bg-blue-600
                text-white
                py-2 sm:py-3 md:py-4
                px-4
                rounded
                hover:bg-blue-700
                transition
                disabled:opacity-60
                text-xs sm:text-sm md:text-base
                font-semibold
                shadow-lg
                tracking-wide
                flex items-center justify-center
                min-h-[40px] sm:min-h-[48px] md:min-h-[52px]
                leading-tight
                whitespace-nowrap
                overflow-hidden
                text-ellipsis
              `}
            >
              <span
                className="block w-full overflow-hidden whitespace-nowrap text-ellipsis "
              >
                {isPending ? "Sending..." : "Send Reset Link"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
