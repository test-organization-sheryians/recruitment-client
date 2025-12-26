import { Suspense } from "react";
import ResetPassword from "@/features/password/components/ResetPassword";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPassword />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">Loading reset password...</p>
    </div>
  );
}
