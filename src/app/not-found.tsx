// app/not-found.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-9xl font-black text-white mb-4 tracking-tighter">
          4<span className="inline-block animate-pulse text-purple-400">0</span>
          4
        </h1>

        <p className="text-2xl md:text-3xl font-semibold text-gray-200 mb-4">
          Oops! Page Not Found
        </p>
        <p className="text-gray-400 mb-10 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="mt-16 text-gray-500 text-sm">
          Error 404 • Lost in cyberspace
        </div>
      </div>
    </div>
  );
}
