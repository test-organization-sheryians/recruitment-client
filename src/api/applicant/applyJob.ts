import api from "@/config/axios";

export const getAllApplicant = async () => {
  try {
    const response = await api.get("/api/job-apply/applicants/6915f115b31a7450d55bf9c2");
    return response.data;
  } catch (error) {
    console.error("Error fetching applicants:", error);
    throw error;
  }
};      