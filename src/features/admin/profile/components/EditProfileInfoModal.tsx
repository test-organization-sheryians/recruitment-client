"use client";

import { useEffect, useState } from "react";
import { KeyRound, LoaderCircleIcon } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { AdminProfile } from "@/types/profile";

import { useUpdateProfile } from "../hooks/useUpdateProfile";
import ChangePasswordModal from "./ChangePasswordModal";

interface EditProfileInfoModalProps {
  profile?: AdminProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void | Promise<void>;
}

export default function EditProfileInfoModal({
  profile,
  isOpen,
  onClose,
  onUpdated,
}: EditProfileInfoModalProps) {
  const [firstName, setFirstName] = useState(profile?.firstName ?? "");
  const [lastName, setLastName] = useState(profile?.lastName ?? "");
  const [phone, setPhone] = useState(profile?.phoneNumber ?? "");
  const [showChangePassword, setShowChangePassword] = useState(false);

  const { error: showError, success: showSuccess } = useToast();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  useEffect(() => {
    if (isOpen) {
      setFirstName(profile?.firstName ?? "");
      setLastName(profile?.lastName ?? "");
      setPhone(profile?.phoneNumber ?? "");
    }
  }, [isOpen, profile?.firstName, profile?.lastName, profile?.phoneNumber]);

  const handleSave = () => {
    updateProfile(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phone.trim(),
      },
      {
        onSuccess: () => {
          showSuccess("Profile updated successfully");
          onClose();
          onUpdated?.();
        },
        onError: (err) => {
          console.error("Update error:", err);
          showError("Failed to update profile");
        },
      },
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Personal Information"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              First Name
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Last Name
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Email (readonly)
            </label>
            <input
              value={profile?.email ?? ""}
              readOnly
              className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="pt-1">
            <button
              onClick={() => setShowChangePassword(true)}
              className="flex items-center cursor-pointer gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              <KeyRound size={15} />
              Change Password
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
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
                  <LoaderCircleIcon className="animate-spin w-5 h-5" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </Modal>

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </>
  );
}
