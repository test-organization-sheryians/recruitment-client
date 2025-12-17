import api from "@/config/axios";

export async function applyJob(payload: {
  jobId: string;
  message?: string;
  resumeUrl?: string;
}) {
  // Updated route to match backend
  const res = await api.post("/api/job-apply", payload);
  return res.data;
}
