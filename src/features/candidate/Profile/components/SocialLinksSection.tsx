"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Modal from "@/components/ui/Modal";
import { LoaderCircleIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import { useUpdateProfile1 } from "../hooks/useProfileApi";

interface Props {
  linkedin?: string;
  github?: string;
  portfolioUrl?: string;
  onUpdate?: () => void;
}

export default function SocialLinksSection({
  linkedin = "",
  github = "",
  portfolioUrl = "",
  onUpdate,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const [linkedinValue, setLinkedinValue] = useState(linkedin);
  const [githubValue, setGithubValue] = useState(github);
  const [portfolioValue, setPortfolioValue] = useState(portfolioUrl);

  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;

  const { mutate: updateProfile, isPending } = useUpdateProfile1();

  const toggleModal = () => setIsOpen((prev) => !prev);

  const handleSave = () => {
    if (!userId) return;

    updateProfile(
      {
        id: userId,
        linkedinUrl: linkedinValue.trim() || "",
        githubUrl: githubValue.trim() || "",
        portfolioUrl: portfolioValue.trim() || "",
      },
      {
        onSuccess: () => {
          toggleModal();
          onUpdate?.();
        },
        onError: () => {
          alert("Failed to update links. Try again.");
        },
      }
    );
  };

  const hasAnyLink = linkedin || github || portfolioUrl;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 border border-gray-200 rounded-xl p-4 md:p-6 bg-white shadow-sm md:shadow-md">

      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <h2 className="text-lg md:text-xl font-bold text-gray-800">
          Social Links
        </h2>

        <button
          onClick={toggleModal}
          className="p-2 md:p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition shadow-md active:scale-95"
          disabled={isPending}
        >
          <FaPlus className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Display Links */}
      {hasAnyLink ? (
        <div className="space-y-3 text-sm md:text-base">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline font-medium break-all"
            >
              LinkedIn → {linkedin}
            </a>
          )}

          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline font-medium break-all"
            >
              GitHub → {github}
            </a>
          )}

          {portfolioUrl && (
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline font-medium break-all"
            >
              Portfolio → {portfolioUrl}
            </a>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-sm md:text-base italic py-4 px-3 bg-gray-50 rounded-lg text-center">
          No social links added yet. Tap + to add them.
        </p>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={toggleModal} title="Edit Social Links">
        <div className="space-y-4 md:space-y-5">

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn Profile
            </label>
            <input
              type="url"
              value={linkedinValue}
              onChange={(e) => setLinkedinValue(e.target.value)}
              placeholder="https://linkedin.com/in/yourname"
              className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Profile
            </label>
            <input
              type="url"
              value={githubValue}
              onChange={(e) => setGithubValue(e.target.value)}
              placeholder="https://github.com/yourname"
              className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Portfolio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio Website
            </label>
            <input
              type="url"
              value={portfolioValue}
              onChange={(e) => setPortfolioValue(e.target.value)}
              placeholder="https://yourportfolio.com"
              className="w-full px-3 md:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3">
            <button
              onClick={toggleModal}
              className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isPending}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <LoaderCircleIcon className="animate-spin w-5 h-5" />
                  Saving...
                </>
              ) : (
                "Save Links"
              )}
            </button>
          </div>

        </div>
      </Modal>
    </div>
  );
}