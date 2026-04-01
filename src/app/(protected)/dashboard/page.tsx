"use client";

import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    
    if (!loading && !user) {
      router.replace("/google-auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-medium text-gray-600">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow">
          <span className="text-gray-700 font-medium">
            {user.name}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-sm text-gray-500 mb-1">Session Status</h2>
          <p className="text-xl font-semibold text-green-600">
            Active
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-sm text-gray-500 mb-1">User Email</h2>
          <p className="text-lg font-medium text-gray-800">
            {user.email}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-sm text-gray-500 mb-1">Role</h2>
          <p className="text-lg font-medium text-blue-600">
            {user.role || "User"}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-2">Welcome 👋</h2>
        <p className="text-gray-600">
          You are successfully logged in. This is your dashboard overview.
        </p>
      </div>
    </div>
  );
}