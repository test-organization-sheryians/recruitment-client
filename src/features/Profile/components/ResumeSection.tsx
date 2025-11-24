"use client";

import { useState, ChangeEvent } from "react";
import { useUploadResume, useDeleteResume, useGetProfile } from "../hooks/useProfileApi";

interface Props {
  resumeUrl?: string;
}

export default function ResumeSection({ resumeUrl }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const { refetch: refetchProfile } = useGetProfile();

// Upload mutation
const uploadMutation = useUploadResume();
const isUploading = uploadMutation.status === "pending";

// Delete mutation
const deleteMutation = useDeleteResume();
const isDeleting = deleteMutation.status === "pending";


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        alert("✅ Resume uploaded successfully");
        setFile(null);
        refetchProfile();
      },
      onError: () => {
        alert("❌ Failed to upload resume");
      },
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        alert("✅ Resume deleted successfully");
        refetchProfile();
      },
      onError: () => {
        alert("❌ Failed to delete resume");
      },
    });
  };

return (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-gray-800">Resume</h2>

    {resumeUrl ? (
      <div className="flex flex-col gap-3 bg-gray-50 border border-gray-200 p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600 font-medium">
              ✅ Resume Uploaded
            </p>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View Resume
            </a>
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    ) : (
      <div className="text-sm text-gray-500 italic">
        No resume uploaded yet
      </div>
    )}

    {/* Upload Section */}
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        Upload new resume
      </label>

      <div className="flex items-center gap-3">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:bg-blue-200 file:text-blue-700
          hover:file:bg-gray-200 transition"
        />

        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  </div>
);


}
