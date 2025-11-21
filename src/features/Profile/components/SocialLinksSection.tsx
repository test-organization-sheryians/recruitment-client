"use client";
import { useState } from "react";
import { useUpdateProfile } from "../hooks/useProfileApi";

interface Props {
  linkedin?: string;
  github?: string;
  portfolioUrl?: string;
  onUpdate?: () => void;
}

export default function SocialLinksSection({ linkedin, github, portfolioUrl, onUpdate }: Props) {
  const [linkedinValue, setLinkedinValue] = useState(linkedin || "");
  const [githubValue, setGithubValue] = useState(github || "");
  const [portfolioValue, setPortfolioValue] = useState(portfolioUrl || "");

  const updateProfileMutation = useUpdateProfile();

  const handleSave = () => {
    updateProfileMutation.mutate(
      {
        linkedinUrl: linkedinValue,
        githubUrl: githubValue,
        portfolioUrl: portfolioValue,
      },
      {
        onSuccess: () => {
          alert("Social links updated successfully");
          onUpdate?.();
        },
        onError: (err: any) => {
          alert(err?.response?.data?.message || "Failed to update socials");
        },
      }
    );
  };

  return (
    <div className="border p-4 rounded space-y-3">
      <h2 className="font-semibold mb-2">Social Links</h2>

      <div className="flex flex-col gap-2">
        <div>
          <label className="block text-sm font-medium">LinkedIn URL</label>
          <input
            type="url"
            value={linkedinValue}
            onChange={(e) => setLinkedinValue(e.target.value)}
            className="w-full border rounded p-1"
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">GitHub URL</label>
          <input
            type="url"
            value={githubValue}
            onChange={(e) => setGithubValue(e.target.value)}
            className="w-full border rounded p-1"
            placeholder="https://github.com/username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Portfolio URL</label>
          <input
            type="url"
            value={portfolioValue}
            onChange={(e) => setPortfolioValue(e.target.value)}
            className="w-full border rounded p-1"
            placeholder="https://myportfolio.com"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}
