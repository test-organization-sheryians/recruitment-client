"use client";

import React from "react";
import { FileUploadArea } from "@/features/AITest/components/FileUploadArea";
import { FilePreview } from "@/features/AITest/components/FilePreview";
import { useFileUpload } from "@/features/AITest/hooks/useFileUpload";
import useAIMutations from "@/features/AITest/hooks/useAIMutations";

const ResumeUpload = () => {
  const { postResumeAndGenerateQuestionsMutation } = useAIMutations();
  const {
    mutateAsync: postResumeAndGenerateQuestionsMutationAsync,
    isPending: postResumeAndGenerateQuestionsMutationIsPending,
    isSuccess: postResumeAndGenerateQuestionsMutationIsSuccess,
    isError: postResumeAndGenerateQuestionsMutationIsError,
    error: postResumeAndGenerateQuestionsMutationError,
  } = postResumeAndGenerateQuestionsMutation;

  // TODO: Navigate after uploading and manage the state
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("pdf", file);

    return await postResumeAndGenerateQuestionsMutationAsync({
      data: formData,
      onProgress: (progress: number) => {
        setUploadProgress(progress);
      },
    });
  };

  const {
    file,
    isDragging,
    uploadProgress,
    isUploading,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeFile,
    setUploadProgress,
  } = useFileUpload({
    onFileUpload: handleFileUpload,
  });

  return (
    <div className="w-full h-full grid place-items-center p-4">
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <h2 className="text-4xl font-medium text-center mb-5">Resume Upload</h2>

        <FileUploadArea
          isUploading={isUploading}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() =>
            !isUploading && document.getElementById("resume-upload")?.click()
          }
          inputId="resume-upload"
          onFileChange={handleFileChange}
        />

        {file && (
          <FilePreview
            file={file}
            uploadProgress={uploadProgress}
            isUploading={isUploading}
            onRemove={removeFile}
          />
        )}

        {postResumeAndGenerateQuestionsMutationIsPending && (
          <p className="text-blue-500">Uploading...</p>
        )}
        {postResumeAndGenerateQuestionsMutationIsSuccess && (
          <p className="text-green-500">Upload successful!</p>
        )}
        {postResumeAndGenerateQuestionsMutationIsError && (
          <p className="text-red-500">
            {postResumeAndGenerateQuestionsMutationError.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
