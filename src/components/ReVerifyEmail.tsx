"use client";

import { Mail, RefreshCw } from "lucide-react";
import { useResendVerification } from "@/features/resendMail/useResendMailApi";
// import { AxiosError } from "axios";

interface Props {
  email: string;
  isVerified: boolean;
}

export default function ReVerifyEmailPage({ email, isVerified }: Props) {
  const { mutateAsync, isPending } = useResendVerification();

  const handleResend = async () => {
    if (isVerified) {
      return;
    }

    try {
      const res = await mutateAsync();
    } catch (error) {
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-10 py-10 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5">
              <Mail className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold">Check Your Email</h1>
            <p className="text-indigo-100 text-lg mt-3">
              We sent a verification link to:
            </p>
            <p className="text-2xl font-bold mt-2 break-all">{email}</p>
          </div>

          <div className="px-10 py-10 space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">One step away!</h2>
              <p className="mt-3 text-gray-600 max-w-md mx-auto">
                Click the link in your email to verify your account and start applying to jobs.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-amber-800 mb-2">Not in your inbox?</p>
              <ul className="text-amber-700 space-y-1">
                <li>• Check spam/junk folder</li>
                <li>• Search for “Sheriyansh”</li>
                <li>• Add <span className="font-medium">no-reply@sheriyansh.com</span> to contacts</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleResend}
                disabled={isVerified || isPending}
                className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 transition transform hover:scale-105 ${
                  isVerified ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <RefreshCw className="w-5 h-5" />
                {isVerified ? "Email Verified" : isPending ? "Sending..." : "Resend Email"}
              </button>

              <button
                onClick={handleRefresh}
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 rounded-xl border-2 border-gray-200 transition"
              >
                I’ve Verified → Refresh
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Need help?{" "}
              <a href="mailto:support@sheriyansh.com" className="text-indigo-600 font-medium hover:underline">
                support@sheriyansh.com
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-white/70 mt-8 text-sm">
          © 2025 Sheriyansh Coding School
        </p>
      </div>
    </div>
  );
}
