import api from "@/config/axios";
import { isAxiosError } from "axios";

export const postResumeAndGenerateQuestions = async (
  data: FormData,
  onProgress: (progress: number) => void
) => {
  try {
    const response = await api.post("/api/ai/questionset", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });

    console.log("Upload successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Upload failed. Please try again."
      );
    }
    throw new Error("An unexpected error occurred");
  }
};
