"use client";

import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useUpdatePassword } from "../hooks/useUpdatePassword";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [show, setShow] = useState({ old: false, new: false, retype: false });

  const { success: showSuccess, error: showError } = useToast();
  const { mutate: updatePassword, isPending } = useUpdatePassword();

  const toggle = (field: keyof typeof show) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!oldPassword) e.oldPassword = "Current password required";
    if (!newPassword) e.newPassword = "New password required";
    else if (newPassword.length < 8)
      e.newPassword = "Minimum 8 characters required";
    if (!retypePassword) e.retypePassword = "Please confirm your password";
    else if (newPassword !== retypePassword)
      e.retypePassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleClose = () => {
    setOldPassword("");
    setNewPassword("");
    setRetypePassword("");
    setErrors({});
    setShow({ old: false, new: false, retype: false });
    onClose();
  };

  const handleSave = () => {
    if (!validate()) return;
    updatePassword(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          showSuccess("Password updated successfully");
          handleClose();
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ?? "Failed to update password";
          showError(msg);
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Password">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Current Password
          </label>
          <div className="relative">
            <input
              type={show.old ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className={`w-full px-4 py-2 pr-10 border rounded-lg ${
                errors.oldPassword ? "border-red-400" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => toggle("old")}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {show.old ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.oldPassword}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={show.new ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className={`w-full px-4 py-2 pr-10 border rounded-lg ${
                errors.newPassword ? "border-red-400" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => toggle("new")}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {show.new ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={show.retype ? "text" : "password"}
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              placeholder="Re-enter new password"
              className={`w-full px-4 py-2 pr-10 border rounded-lg ${
                errors.retypePassword ? "border-red-400" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => toggle("retype")}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {show.retype ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.retypePassword && (
            <p className="text-xs text-red-500 mt-1">{errors.retypePassword}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={handleClose}
            className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin w-4 h-4" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
