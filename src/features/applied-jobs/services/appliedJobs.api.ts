import apiClient from "@/lib/api-client";
import { AppliedJob } from "../types/appliedjobs.types";

export async function getAppliedJobs(): Promise<AppliedJob[]> {
  try {
    const res = await apiClient.get("/job-apply/my-applications");

    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (error) {
    console.error("getAppliedJobs failed:", error);
    return []; // ❗ NEVER let undefined escape
  }
}
