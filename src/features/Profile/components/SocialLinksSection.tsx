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
    // Stringify the object to match the expected string parameter
    const profileData = JSON.stringify({
      linkedinUrl: linkedinValue,
      githubUrl: githubValue,
      portfolioUrl: portfolioValue,
    });

    updateProfileMutation.mutate(
      profileData,
      {
        onSuccess: () => {
          alert("Social links updated successfully");
          onUpdate?.();
        },
        onError: (err: unknown) => {
          let errorMessage = "Failed to update socials";
          
          if (err instanceof Error) {
            errorMessage = err.message;
          } else if (typeof err === 'object' && err !== null && 'response' in err) {
            // For Axios-like errors
            const errorObj = err as { response?: { data?: { message?: string } } };
            errorMessage = errorObj.response?.data?.message || errorMessage;
          }
          
          alert(errorMessage);
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
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}