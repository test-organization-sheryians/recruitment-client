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
  const userId = user?.id

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
    <div className="space-y-6 border border-gray-200 rounded-xl p-6 bg-white shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Social Links</h2>
        <button
          onClick={toggleModal}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg"
          disabled={isPending}
        >
          <FaPlus className="w-5 h-5" />
        </button>
      </div>

      {/* Display Links */}
      {hasAnyLink ? (
        <div className="space-y-3">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-blue-600 hover:underline font-medium"
            >
              LinkedIn → {linkedin}
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-blue-600 hover:underline font-medium"
            >
              GitHub → {github}
            </a>
          )}
          {portfolioUrl && (
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-blue-600 hover:underline font-medium"
            >
              Portfolio → {portfolioUrl}
            </a>
          )}
        </div>
      ) : (
        <p className="text-gray-500 italic py-4 bg-gray-50 rounded-lg">
          No social links added yet. Click the + button to add them!
        </p>
      )}

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={toggleModal} title="Edit Social Links">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn Profile
            </label>
            <input
              type="url"
              value={linkedinValue}
              onChange={(e) => setLinkedinValue(e.target.value)}
              placeholder="https://linkedin.com/in/yourname"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Profile
            </label>
            <input
              type="url"
              value={githubValue}
              onChange={(e) => setGithubValue(e.target.value)}
              placeholder="https://github.com/yourname"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio Website
            </label>
            <input
              type="url"
              value={portfolioValue}
              onChange={(e) => setPortfolioValue(e.target.value)}
              placeholder="https://yourportfolio.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={toggleModal}
              className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
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