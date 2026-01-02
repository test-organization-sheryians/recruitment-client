import * as api from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";



export const useJobApplicant = (id: string) => {
    return useQuery({
        queryKey: ["jobApplicant", id],
        queryFn: () => api.getAllApplicant(id),
        enabled: !!id,
        retry: 0,
    });
};



export const useBulkUpdateApplicants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: api.BulkUpdatePayload) =>
      api.bulkUpdateData(payload),

    onSuccess: () => {
      // 🔁 refetch applicants after update (match keys with prefix)
      queryClient.invalidateQueries({ queryKey: ["jobApplicant"] });
      // update shortlisted KPI: invalidate and proactively fetch fresh data
      queryClient.invalidateQueries({ queryKey: ["shortlistedCount"] });
      queryClient
        .fetchQuery({
          queryKey: ["shortlistedCount"],
          queryFn: () => api.getShortlistedCount(),
        })
        .catch(() => {
          // ignore; invalidateQueries will cause eventual refetch
        });
    },

    retry: 0,
  });

}