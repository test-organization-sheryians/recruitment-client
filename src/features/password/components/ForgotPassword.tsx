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
        const message =
          error?.response?.data?.message ||
          "Failed to send reset password email";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Forgot Password
        </h2>

        {/* SUCCESS MESSAGE */}
        {data?.message && (
          <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm">
            {data.message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {isError && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
