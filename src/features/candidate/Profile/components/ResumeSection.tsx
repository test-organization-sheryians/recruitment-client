"use client";

import { useState, ChangeEvent } from "react";
import { useUpdateProfile1, useDeleteResume, useGetProfile } from "../hooks/useProfileApi";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import { FaPlus } from "react-icons/fa";
import Modal from "@/components/ui/Modal";
import { uploadFileToS3 } from "@/lib/uploadFile";

interface Props {
  resumefile?: string;
}

export default function ResumeSection({ resumefile }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { refetch: refetchProfile } = useGetProfile();
  const user = useSelector((state: RootState) => state.auth.user);

  // delete resume
  const deleteMutation = useDeleteResume();
  const isDeleting = deleteMutation.status === "pending";

  // update profile hook
  const updateProfile = useUpdateProfile1();
  const isUploading = updateProfile.status === "pending";

  const toggleModal = () => setIsOpen(!isOpen);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Frontend validation
    if (selected.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file || !user?.id) return;

    try {
      const finalUrl = await uploadFileToS3(file);
      
      updateProfile.mutate({
        id: user.id,
        resumeFile: finalUrl
      }, {
        onSuccess: () => {
          setIsOpen(false);
          setFile(null);
          refetchProfile();
        }
      });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload resume. Please try again.");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your resume?")) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          refetchProfile();
        },
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Resume</h2>
        {resumefile ? (
          <button
            onClick={toggleModal}
            className="bg-blue-600 hover:bg-blue-800 text-md px-3 py-1 rounded-md text-white cursor-pointer"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={toggleModal}
            className="p-2 rounded-full bg-blue-600 cursor-pointer text-white hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
          >
            <FaPlus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Resume display */}
      <div className="space-y-2">
        {resumefile ? (
          <div className="flex items-center justify-between bg-gray-100 border border-gray-200 px-4 py-3 rounded-xl">
            <a
              href={resumefile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline cursor-pointer"
            >
              View Resume
            </a>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-500 text-sm hover:text-red-700 transition cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">
            No resume uploaded yet
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={toggleModal} title="Upload Resume">
        <div className="flex flex-col gap-4">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
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
