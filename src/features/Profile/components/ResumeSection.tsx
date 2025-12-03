"use client";

import { useState, ChangeEvent } from "react";
import { useUploadResume, useDeleteResume, useGetProfile } from "../hooks/useProfileApi";
import { FaPlus } from "react-icons/fa";
import Modal from "@/components/ui/Modal";

interface Props {
  resumeUrl?: string;
}

export default function ResumeSection({ resumeUrl }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { refetch: refetchProfile } = useGetProfile();

  const uploadMutation = useUploadResume();
  const isUploading = uploadMutation.status === "pending";

  const deleteMutation = useDeleteResume();
  const isDeleting = deleteMutation.status === "pending";

  const toggleModal = () => setIsOpen(!isOpen);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
  
    uploadMutation.mutate(file, {
      onSuccess: (signedUrl) => {
        console.log("FINAL FILE URL:", signedUrl);
        setFile(null);
        setIsOpen(false);
        refetchProfile();
      },
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        refetchProfile();
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Header like Skills */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Resume</h2>

        <button onClick={toggleModal}>
          <FaPlus />
        </button>
      </div>

      {/* Resume View */}
      {resumeUrl ? (
        <div className="flex items-center justify-between bg-gray-100 border border-gray-200 px-4 py-3 rounded-xl">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            View Resume
          </a>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 text-sm hover:text-red-700 transition"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">
          No resume uploaded yet
        </div>
      )}

      {/* Modal like Skills */}
      <Modal isOpen={isOpen} onClose={toggleModal} title="Upload Resume">
        <div className="flex flex-col gap-4">
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
            className="bg-blue-800 text-white px-5 py-2 rounded-lg hover:bg-blue-900 transition disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload Resume"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
