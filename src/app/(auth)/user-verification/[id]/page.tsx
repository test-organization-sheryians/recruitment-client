"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useVerifyUser } from "@/features/auth/hooks/useAuthApi";

export default function VerificationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const { mutate: verify } = useVerifyUser();

  useEffect(() => {
    if (!id) return;

    verify(id as string, {
      onSuccess: () => {
        setStatus("success");
        setTimeout(() => router.push("/login"), 2000);
      },
      onError: () => {
        setStatus("error");
      },
    });
  }, [id, verify, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Verifying your email...</h2>
            <p className="text-gray-600 mt-2">Please wait while we confirm your account.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Email Verified Successfully!</h2>
            <p className="text-gray-600 mt-2">
              Your account is now active. Redirecting you to login...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
            <p className="text-gray-600 mt-2">
              The link may be invalid or already used.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}