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
  <div className="bg-white  rounded-2xl p-6  space-y-5">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-800">
        Social Links
      </h2>
    </div>

    <div className="grid grid-cols-1 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          LinkedIn
        </label>
        <input
          type="url"
          value={linkedinValue}
          onChange={(e) => setLinkedinValue(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="https://linkedin.com/in/username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          GitHub
        </label>
        <input
          type="url"
          value={githubValue}
          onChange={(e) => setGithubValue(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="https://github.com/username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Portfolio
        </label>
        <input
          type="url"
          value={portfolioValue}
          onChange={(e) => setPortfolioValue(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="https://myportfolio.com"
        />
      </div>

      <div className="pt-2">
        <button
          onClick={handleSave}
          disabled={updateProfileMutation.isPending}
          className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-lg font-medium transition disabled:opacity-60"
        >
          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
);

}