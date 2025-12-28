import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api/jobs/savedJob";
import type { SavedJob } from "@/types/Job";

/* -------------------- Get Saved Jobs -------------------- */
export const useGetSavedJobs = () => {
  return useQuery<SavedJob[]>({
    queryKey: ["saved-jobs"],
    queryFn: api.getSavedJobs,
  });
};

/* -------------------- Save Job -------------------- */
export const useSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.saveJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job"] });
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
  });
};

/* -------------------- Unsave Job -------------------- */
export const useUnsaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.unsaveJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job"] });
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
  });
};
