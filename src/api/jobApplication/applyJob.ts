import api from "@/config/axios";

// Fetch all applicants for a job
export const getAllApplicant = async (id: string) => {
  try {
    const response = await api.get(`/api/job-apply/applicants/${id}`);
    console.log("Fetched applicants:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching applicants:", error);
    throw error;
  }
};

// Optionally, also export applyJob function
export const applyJob = async (payload: {
  jobId: string;
  message?: string;
  resumeUrl?: string;
}) => {
  const res = await api.post("/api/job-apply", payload);
  return res.data;
};
