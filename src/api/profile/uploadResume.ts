import api from "@/config/axios";

export const uploadResume = async (data: FormData) => {
  const response = await api.post("/api/candidate-profile/upload-resume", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
