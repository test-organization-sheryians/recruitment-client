

import api from "@/config/axios"


export type ApplyJobVariables = {
  jobId: string
  message?: string
  resumeUrl?: string
}

export type ApplyJobResponse = {
  message: string
}

// export async function applyJob(
//   payload: ApplyJobVariables
// ): Promise<ApplyJobResponse> {
//   const res = await api.post("/api/job-apply", payload)
//   return res.data
// }
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
