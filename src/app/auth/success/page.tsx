import { Suspense } from "react";
import AuthSuccessClient from "./AuthSuccessClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#4C62ED]" />
            <p className="text-sm text-gray-500 font-[satoshi]">
              Signing you in...
            </p>
          </div>
        </div>
      }
    >
      <AuthSuccessClient />
    </Suspense>
  );
}