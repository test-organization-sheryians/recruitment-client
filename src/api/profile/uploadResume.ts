import api from "@/config/axios";

const uploadResume = async (file: File) => {
  const response = await api.post("/api/aws/presignedurl-s3", { fileName: file.name, contentType: file.type });
  return response.data;
};
