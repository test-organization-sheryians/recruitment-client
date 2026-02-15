import api from "@/config/axios";
import { Certificate, CertificateField } from "@/types/Certificate";

/* ================= CREATE CERTIFICATE ================= */
export const createCertificate = async (
  data: Omit<Certificate, "_id" | "createdAt" | "updatedAt">
): Promise<Certificate> => {
  const response = await api.post("/api/certificates", data);
  return response.data;
};



// /* ================= CREATE FIELDS ================= */
// export const createFields = async (
//   data: CertificateField[]
// ): Promise<CertificateField[]> => {
//   const response = await api.post("/api/fields", data);
//   return response.data;
// };

// /* ================= GET FIELDS BY CERTIFICATE ================= */
// export const getFieldsByCertificate = async (
//   certificateId: string
// ): Promise<CertificateField[]> => {
//   const response = await api.get(
//     `/api/fields/${certificateId}`
//   );
//   return response.data.data;
// };

// /* ================= DELETE FIELD ================= */
// export const deleteField = async (fieldId: string) => {
//   const response = await api.delete(`/api/fields/${fieldId}`);
//   return response.data;
// };
