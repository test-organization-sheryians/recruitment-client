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
  type FieldName = "linkedin" | "github" | "portfolio" | "leetcode";

  const [isOpen, setIsOpen] = useState(false);

  const [linkedinValue, setLinkedinValue] = useState(linkedin);
  const [githubValue, setGithubValue] = useState(github);
  const [portfolioValue, setPortfolioValue] = useState(portfolioUrl);
  const [leetcodeValue, setLeetcodeValue] = useState(leetcode); 
  const [fieldErrors, setFieldErrors] = useState<Record<FieldName, string>>({
    linkedin: "",
    github: "",
    portfolio: "",
    leetcode: "",
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;

  const { mutate: updateProfile, isPending } = useUpdateProfile1();

  const normalizeUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const isValidHttpUrl = (value: string) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const isAllowedHost = (value: string, allowedHosts: string[]) => {
    try {
      const parsed = new URL(value);
      const host = parsed.hostname.toLowerCase();
      return allowedHosts.some(
        (allowed) => host === allowed || host.endsWith(`.${allowed}`)
      );
    } catch {
      return false;
    }
  };

  const validateField = (name: FieldName, value: string) => {
    if (!value) return "";
    if (value.includes(" ")) return "URL cannot contain spaces";
    if (!isValidHttpUrl(value)) return "Please enter a valid URL";

    if (name === "linkedin" && !isAllowedHost(value, ["linkedin.com", "lnkd.in"])) {
      return "Please enter a valid LinkedIn URL";
    }

    if (name === "github" && !isAllowedHost(value, ["github.com"])) {
      return "Please enter a valid GitHub URL";
    }

    if (name === "leetcode" && !isAllowedHost(value, ["leetcode.com"])) {
      return "Please enter a valid LeetCode URL";
    }

    return "";
  };

  const mapBackendErrorsToFields = (message: string) => {
    const errors: Record<FieldName, string> = {
      linkedin: "",
      github: "",
      portfolio: "",
      leetcode: "",
    };

    if (/LinkedIn URL/i.test(message)) errors.linkedin = "LinkedIn URL must be a valid URL";
    if (/GitHub URL/i.test(message)) errors.github = "GitHub URL must be a valid URL";
    if (/Portfolio URL/i.test(message)) errors.portfolio = "Portfolio URL must be a valid URL";
    if (/LeetCode URL|leetcode Url|leetcode URL|LeetcodeUrl URL/i.test(message)) {
      errors.leetcode = "LeetCode URL must be a valid URL";
    }

    return errors;
  };

  const toggleModal = () => setIsOpen((prev) => !prev);

  const handleChange = (field: FieldName, value: string) => {
    if (field === "linkedin") setLinkedinValue(value);
    if (field === "github") setGithubValue(value);
    if (field === "portfolio") setPortfolioValue(value);
    if (field === "leetcode") setLeetcodeValue(value);

    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSave = () => {
    if (!userId) return;

    const normalized = {
      linkedin: normalizeUrl(linkedinValue),
      github: normalizeUrl(githubValue),
      portfolio: normalizeUrl(portfolioValue),
      leetcode: normalizeUrl(leetcodeValue),
    };

    const nextErrors: Record<FieldName, string> = {
      linkedin: validateField("linkedin", normalized.linkedin),
      github: validateField("github", normalized.github),
      portfolio: validateField("portfolio", normalized.portfolio),
      leetcode: validateField("leetcode", normalized.leetcode),
    };

    setFieldErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    updateProfile(
      {
        id: userId,
        linkedinUrl: normalized.linkedin,
        githubUrl: normalized.github,
        portfolioUrl: normalized.portfolio,
        leetcodeUrl: normalized.leetcode,
      },
      {
        onSuccess: () => {
          toggleModal();
          onUpdate?.();
        },
        onError: (error: unknown) => {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            (error as { message?: string })?.message ||
            "";

          const mappedErrors = mapBackendErrorsToFields(message);
          if (Object.values(mappedErrors).some(Boolean)) {
            setFieldErrors(mappedErrors);
          }
        },
      }
    );
  };

  const hasAnyLink =
    linkedin || github || portfolioUrl || leetcode; 

  return (
    <div className="space-y-6 border border-gray-200 rounded-xl p-6 bg-white shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Social Links</h2>
        <button
          onClick={toggleModal}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg cursor-pointer"
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

          {leetcode && ( 
            <a
              href={leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-blue-600 hover:underline font-medium"
            >
              LeetCode → {leetcode}
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
          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn Profile
            </label>
            <input
              type="url"
              value={linkedinValue}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/yourname"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                fieldErrors.linkedin ? "border-red-500" : "border-gray-300"
              }`}
            />
            {fieldErrors.linkedin && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.linkedin}</p>
            )}
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Profile
            </label>
            <input
              type="url"
              value={githubValue}
              onChange={(e) => handleChange("github", e.target.value)}
              placeholder="https://github.com/yourname"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                fieldErrors.github ? "border-red-500" : "border-gray-300"
              }`}
            />
            {fieldErrors.github && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.github}</p>
            )}
          </div>

          {/* Portfolio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio Website
            </label>
            <input
              type="url"
              value={portfolioValue}
              onChange={(e) => handleChange("portfolio", e.target.value)}
              placeholder="https://yourportfolio.com"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                fieldErrors.portfolio ? "border-red-500" : "border-gray-300"
              }`}
            />
            {fieldErrors.portfolio && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.portfolio}</p>
            )}
          </div>

          {/* LeetCode  */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LeetCode Profile
            </label>
            <input
              type="url"
              value={leetcodeValue}
              onChange={(e) => handleChange("leetcode", e.target.value)}
              placeholder="https://leetcode.com/yourname"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                fieldErrors.leetcode ? "border-red-500" : "border-gray-300"
              }`}
            />
            {fieldErrors.leetcode && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.leetcode}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={toggleModal}
              className="px-5 py-2 border border-gray-300 cursor-pointer rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-6 py-2 bg-blue-600 text-white cursor-pointer rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
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
