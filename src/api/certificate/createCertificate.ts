import api from "@/config/axios";
import { Certificate, CertificateField } from "@/types/Certificate";

/* ================= CREATE CERTIFICATE ================= */
export const createCertificate = async (
  data: Omit<Certificate, "_id" | "createdAt" | "updatedAt">
): Promise<Certificate> => {
  try {
    const response = await api.post("/api/certificates", data);
    
    // Check if response exists and contains expected data structure
    if (!response.data || !response.data.data) {
      throw new Error("Invalid response structure from server");
    }
    
    return response.data.data;
  } catch (error) {
    // Re-throwing error to be caught by the React Query Mutation's onError
    console.error("API Error: Failed to create certificate", error);
    throw error;
  }
};


