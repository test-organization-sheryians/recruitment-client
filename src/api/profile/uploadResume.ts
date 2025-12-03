import api from "@/config/axios";

export const uploadResume = async (file: File) => {
  const response = await api.post("/api/aws/presignedurl-s3", { fileName: file.name, contentType: file.type });
  console.log(response.data)
  return response.data;
};
