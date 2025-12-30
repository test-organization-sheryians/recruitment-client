"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { useResetPassword } from "../hooks/useForgotPasswordApi"
import { useToast } from "@/components/ui/Toast"
import { Eye, EyeOff } from "lucide-react"

export default function ResetPassword() {
  const toast = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { mutate, data, error, isPending, isError } = useResetPassword()

  // 🔒 Block page if token missing
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600 text-lg font-medium">
          Invalid or expired reset link
        </p>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    mutate(
      { token, newPassword, confirmPassword },
      {
        onSuccess: () => {
          toast.success("Password reset successfully")
          router.push("/login")
        },
        onError: (error: unknown) => {
          let message = "Failed to reset password"

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message
      }
          toast.error(message )
        },
      }
    )
  }

  const errorMessage =
    isError && axios.isAxiosError(error)
      ? error.response?.data?.message
      : "Something went wrong"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold">HRECT.</h1>
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        {/* SUCCESS */}
        {data?.message && (
          <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm">
            {data.message}
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block mb-1 font-medium">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full border border-gray-300 p-2 rounded pr-10"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full border border-gray-300 p-2 rounded pr-10"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  )
}
