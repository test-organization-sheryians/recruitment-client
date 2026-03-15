import api from "@/config/axios"; 
import { Certificate, CertificateField } from "@/types/Certificate"; 

/* ================= GET SINGLE CERTIFICATE ================= */
export const getCertificateById = async (
  certificateId: string
): Promise<Certificate> => {
  const response = await api.get(`/api/certificates/${certificateId}`);
  return response.data?.data;
};
