import api from "@/config/axios";


/* ================= DELETE CERTIFICATE ================= */
export const deleteCertificate = async (certificateId: string) => {
  const response = await api.delete(
    `/api/certificates/${certificateId}`
  );
  return response.data;
};