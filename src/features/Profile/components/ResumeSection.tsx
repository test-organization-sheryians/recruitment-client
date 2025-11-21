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
    <div className="border p-4 rounded space-y-3">
      <h2 className="font-semibold mb-2">Resume</h2>

      {resumeUrl ? (
        <div className="flex flex-col gap-2">
          <p className="text-green-600">Resume Uploaded</p>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View / Download
          </a>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white px-3 py-1 rounded mt-1 w-fit"
          >
            {isDeleting ? "Deleting..." : "Delete Resume"}
          </button>
        </div>
      ) : (
        <p className="text-gray-500">No resume uploaded</p>
      )}

      <div className="flex gap-2 items-center mt-2">
        <input
          type="file"
          onChange={handleFileChange}
          className="border px-2 py-1 rounded"
          accept=".pdf,.doc,.docx"
        />
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="bg-black text-white px-3 py-1 rounded"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
