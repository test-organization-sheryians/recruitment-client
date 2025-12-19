import apiClient from "@/lib/api-client";
import { AppliedJob } from "../types/appliedjobs.types";

export async function getAppliedJobs(): Promise<AppliedJob[]> {
  const res = await apiClient.get("/job-apply/my-applications");
  return res.data.data;
}
