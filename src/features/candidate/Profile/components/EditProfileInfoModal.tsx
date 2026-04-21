"use client";

import { useEffect, useState } from "react";
import { KeyRound, LoaderCircleIcon } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { CandidateProfile } from "@/types/profile";

import { useUpdateMe } from "../hooks/useProfileApi";
import ChangePasswordModal from "./ChangePasswordModal";

interface EditProfileInfoModalProps {
  profile?: CandidateProfile;
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
  const [firstName, setFirstName] = useState(profile?.user?.firstName ?? "");
  const [lastName, setLastName] = useState(profile?.user?.lastName ?? "");
  const [phone, setPhone] = useState(profile?.user?.phoneNumber ?? "");
  const [showChangePassword, setShowChangePassword] = useState(false);

  const { error: showError } = useToast();
  const { mutate: updateMe, isPending } = useUpdateMe();

  useEffect(() => {
    if (isOpen) {
      setFirstName(profile?.user?.firstName ?? "");
      setLastName(profile?.user?.lastName ?? "");
      setPhone(profile?.user?.phoneNumber ?? "");
    }
  }, [
    isOpen,
    profile?.user?.firstName,
    profile?.user?.lastName,
    profile?.user?.phoneNumber,
  ]);

  const handleSave = () => {
    updateMe(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phone.trim(),
      },
      {
        onSuccess: () => {
          onClose();
          onUpdated?.();
        },
        onError: () => {
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
        <div className="space-y-4 sm:space-y-5 max-h-[80vh] overflow-y-auto pr-1">

          {/* First Name */}
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1">
              First Name
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1">
              Last Name
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1">
              Email
            </label>
            <input
              value={profile?.user?.email ?? ""}
              readOnly
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-200 bg-gray-100 rounded-lg"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1">
              Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Change Password */}
          <div>
            <button
              onClick={() => setShowChangePassword(true)}
              className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:underline"
            >
              <KeyRound size={16} />
              Change Password
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">

            <button
              onClick={onClose}
              className="
                w-full sm:w-auto
                px-4 sm:px-5
                py-2
                border border-gray-300
                rounded-lg
                text-sm
                hover:bg-gray-50
              "
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isPending}
              className="
                w-full sm:w-auto
                px-5 sm:px-6
                py-2
                bg-blue-600
                text-white
                rounded-lg
                text-sm
                font-medium
                hover:bg-blue-700
                disabled:opacity-50
                flex items-center justify-center gap-2
              "
            >
              {isPending ? (
                <>
                  <LoaderCircleIcon className="animate-spin w-4 h-4" />
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