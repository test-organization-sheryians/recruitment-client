import api from "@/config/axios";

/* ================= GENERATE & SEND CERTIFICATES ================= */
export const generateAndSendCertificates = async (
  file: File,
  templateUrl: string
) => {
  const formData = new FormData();
  formData.append("excel", file); 
  formData.append("templateUrl", templateUrl);

  const response = await api.post(
    "/api/certificates/generate-and-send",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};