import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UnauthorizedPage() {
  const user = await getCurrentUser();
  if (user?.role === "admin") {
    redirect("/admin");
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 max-w-sm w-full text-center border border-white/20">
        <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <p className="text-lg font-medium text-yellow-300 mb-3">Unauthorized</p>
        <p className="text-gray-600 text-sm mb-6">
          You don't have permission to access this page.
        </p>

        <a
          href="/"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
