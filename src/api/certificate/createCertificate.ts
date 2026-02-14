// import axios from "axios";
// import { Certificate } from "@/types/Certificate";

// const API_URL = "http://localhost:5000/api/certificates"; // adjust

// export const createCertificateAPI = async (data: Certificate) => {
//   const res = await axios.post(API_URL, data, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`
//     }
//   });
//   return res.data;
// };

// export const getCertificatesAPI = async () => {
//   const res = await axios.get(API_URL, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`
//     }
//   });
//   return res.data;
// };

import api from "@/config/axios";
import { Certificate, CertificateField } from "@/types/Certificate";

/* ================= CREATE CERTIFICATE ================= */
export const createCertificate = async (
  data: Omit<Certificate, "_id" | "createdAt" | "updatedAt">
): Promise<Certificate> => {
  const response = await api.post("/api/certificates", data);
  return response.data;
};

/* ================= GET ALL CERTIFICATES ================= */
export const getAllCertificates = async (): Promise<Certificate[]> => {
  const response = await api.get("/api/certificates");
  return response.data.data;
};

/* ================= GET SINGLE CERTIFICATE ================= */
export const getCertificateById = async (
  certificateId: string
): Promise<Certificate> => {
  const response = await api.get(`/api/certificates/${certificateId}`);
  return response.data.data;
};

/* ================= UPDATE CERTIFICATE ================= */
export const updateCertificate = async (
  certificateId: string,
  data: Partial<Certificate>
) => {
  const response = await api.put(
    `/api/certificates/${certificateId}`,
    data
  );
  return response.data;
};

/* ================= DELETE CERTIFICATE ================= */
export const deleteCertificate = async (certificateId: string) => {
  const response = await api.delete(
    `/api/certificates/${certificateId}`
  );
  return response.data;
};


/* ================= CREATE FIELDS ================= */
export const createFields = async (
  data: CertificateField[]
): Promise<CertificateField[]> => {
  const response = await api.post("/api/fields", data);
  return response.data;
};

/* ================= GET FIELDS BY CERTIFICATE ================= */
export const getFieldsByCertificate = async (
  certificateId: string
): Promise<CertificateField[]> => {
  const response = await api.get(
    `/api/fields/${certificateId}`
  );
  return response.data.data;
};

/* ================= DELETE FIELD ================= */
export const deleteField = async (fieldId: string) => {
  const response = await api.delete(`/api/fields/${fieldId}`);
  return response.data;
};
