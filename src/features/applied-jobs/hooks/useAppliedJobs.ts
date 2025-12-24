import { useQuery } from "@tanstack/react-query";
import { getAppliedJobs } from "../services/appliedJobs.api";
import { AppliedJob } from "../types/appliedjobs.types";

export function useAppliedJobs() {
  return useQuery<AppliedJob[]>({
    queryKey: ["appliedJobs"], 
    queryFn: getAppliedJobs,
    staleTime: 1000 * 60 * 5,
  });
}
