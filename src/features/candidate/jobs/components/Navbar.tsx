"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <div className="text-xl font-bold text-gray-800">
          <span className="text-blue-600">HRECT</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="#" className="hover:text-blue-600">Jobs</Link>
          <Link href="#" className="hover:text-blue-600">For Companies</Link>
          <Link href="#" className="hover:text-blue-600">About</Link>
          <Link href="#" className="hover:text-blue-600">Contact</Link>
          <Link href="#" className="hover:text-blue-600">Blog</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600">
            Login
          </Link>
          <Link
            href="#"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
