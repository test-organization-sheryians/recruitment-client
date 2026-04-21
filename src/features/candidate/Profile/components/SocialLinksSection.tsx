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
  leetcode?: string;
  onUpdate?: () => void;
}

export default function SocialLinksSection({
  linkedin = "",
  github = "",
  portfolioUrl = "",
  leetcode = "",
  onUpdate,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const [linkedinValue, setLinkedinValue] = useState(linkedin);
  const [githubValue, setGithubValue] = useState(github);
  const [portfolioValue, setPortfolioValue] = useState(portfolioUrl);
  const [leetcodeValue, setLeetcodeValue] = useState(leetcode);

  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;

  const { mutate: updateProfile, isPending } = useUpdateProfile1();

  const handleSave = () => {
    if (!userId) return;

    updateProfile(
      {
        id: userId,
        linkedinUrl: linkedinValue.trim(),
        githubUrl: githubValue.trim(),
        portfolioUrl: portfolioValue.trim(),
        leetcodeUrl: leetcodeValue.trim(),
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          onUpdate?.();
        },
      }
    );
  };

  const hasAnyLink =
    linkedin || github || portfolioUrl || leetcode;

  return (
    <div className="space-y-4 sm:space-y-6 border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 bg-white shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-2 sm:pb-3">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
          Social Links
        </h2>

        <button
          onClick={() => setIsOpen(true)}
          disabled={isPending}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <FaPlus className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* LINKS */}
      {hasAnyLink ? (
        <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">

          {[{ label: "LinkedIn", url: linkedin },
          { label: "GitHub", url: github },
          { label: "Portfolio", url: portfolioUrl },
          { label: "LeetCode", url: leetcode }
          ].map(
            (item) =>
              item.url && (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline break-all"
                >
                  <span className="font-medium">{item.label} → </span>
                  {item.url}
                </a>
              )
          )}
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-gray-500 italic bg-gray-50 rounded-lg px-3 py-3">
          No social links added yet. Click + to add them.
        </p>
      )}

      {/* MODAL */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Social Links"
      >
        <div className="space-y-4 sm:space-y-5 max-h-[80vh] overflow-y-auto pr-1">

          {[
            {
              label: "LinkedIn",
              value: linkedinValue,
              set: setLinkedinValue,
              placeholder: "https://linkedin.com/in/yourname",
            },
            {
              label: "GitHub",
              value: githubValue,
              set: setGithubValue,
              placeholder: "https://github.com/yourname",
            },
            {
              label: "Portfolio",
              value: portfolioValue,
              set: setPortfolioValue,
              placeholder: "https://yourportfolio.com",
            },
            {
              label: "LeetCode",
              value: leetcodeValue,
              set: setLeetcodeValue,
              placeholder: "https://leetcode.com/yourname",
            },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-xs sm:text-sm text-gray-600 mb-1 block">
                {field.label}
              </label>

              <input
                type="url"
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">

            <button
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isPending}
              className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <LoaderCircleIcon className="animate-spin w-4 h-4" />
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