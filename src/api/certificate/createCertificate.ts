import api from "@/config/axios";
import { Certificate, CertificateField } from "@/types/Certificate";

/* ================= CREATE CERTIFICATE ================= */
export const createCertificate = async (
  data: Omit<Certificate, "_id" | "createdAt" | "updatedAt">
): Promise<Certificate> => {
  const response = await api.post("/api/certificates", data);
  return response.data.data; 
};


