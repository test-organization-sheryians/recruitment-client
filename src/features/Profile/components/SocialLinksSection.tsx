"use client";
import { useState } from "react";
import { useUpdateProfile } from "../hooks/useProfileApi";
import { FaPlus } from "react-icons/fa";
import Modal from "@/components/ui/Modal";

interface Props {
  linkedin?: string;
  github?: string;
  portfolioUrl?: string;
  onUpdate?: () => void;
}

export default function SocialLinksSection({
  linkedin,
  github,
  portfolioUrl,
  onUpdate,
}: Props) {
  const [linkedinValue, setLinkedinValue] = useState(linkedin || "");
  const [githubValue, setGithubValue] = useState(github || "");
  const [portfolioValue, setPortfolioValue] = useState(portfolioUrl || "");
  const [isOpen, setIsOpen] = useState(false);

  const updateProfileMutation = useUpdateProfile();

  const toggleModal = () => setIsOpen(!isOpen);

  const handleSave = () => {
    const profileData = JSON.stringify({
      linkedinUrl: linkedinValue,
      githubUrl: githubValue,
      portfolioUrl: portfolioValue,
    });

    updateProfileMutation.mutate(profileData, {
      onSuccess: () => {
        setIsOpen(false);
        onUpdate?.();
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Header like Skills */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Social Links</h2>

        <button onClick={toggleModal}>
          <FaPlus />
        </button>
      </div>

      {/* Display Section */}
      {linkedin || github || portfolioUrl ? (
        <div className="space-y-2 text-sm">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              className="block text-blue-600 hover:underline"
            >
              LinkedIn
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              className="block text-blue-600 hover:underline"
            >
              GitHub
            </a>
          )}
          {portfolioUrl && (
            <a
              href={portfolioUrl}
              target="_blank"
              className="block text-blue-600 hover:underline"
            >
              Portfolio
            </a>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">
          No social links added yet
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={toggleModal} title="Edit Social Links">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">LinkedIn</label>
            <input
              type="url"
              value={linkedinValue}
              onChange={(e) => setLinkedinValue(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/60 transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">GitHub</label>
            <input
              type="url"
              value={githubValue}
              onChange={(e) => setGithubValue(e.target.value)}
              placeholder="https://github.com/username"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/60 transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Portfolio</label>
            <input
              type="url"
              value={portfolioValue}
              onChange={(e) => setPortfolioValue(e.target.value)}
              placeholder="https://myportfolio.com"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/60 transition"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className="bg-blue-800 text-white px-5 py-2 rounded-lg hover:bg-blue-900 transition disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Links"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
