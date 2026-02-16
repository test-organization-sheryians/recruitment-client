import api from "@/config/axios"; 
import { Certificate, CertificateField } from "@/types/Certificate"; 
/* ================= GET ALL CERTIFICATES ================= */
export const getAllCertificates = async (): Promise<Certificate[]> => {
  const response = await api.get("/api/certificates");
  return response.data.data;
};
