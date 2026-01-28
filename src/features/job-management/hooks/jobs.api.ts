import apiClient from "@/lib/api-client";

export const createJob = (payload: any) => {
  return apiClient.post("/jobs", payload);
};
