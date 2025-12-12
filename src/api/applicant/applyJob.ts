import api from "@/config/axios";

export const getAllApplicant = async (id: string) => {
  try {
    const response = await api.get(`/api/job-apply/applicants/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching applicants:", error);
    throw error;
  }
};      