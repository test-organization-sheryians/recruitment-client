import * as api from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

    onSuccess: (response) => {
      console.debug("bulkUpdate response:", response);

      const counts = response?.counts;

      // 🔁 Refresh applicants list
      queryClient.invalidateQueries({ queryKey: ["jobApplicant"] });

      // 🔁 Update shortlisted count
      if (counts) {
        queryClient.setQueryData(["shortlistedCount"], () => counts);

        queryClient.refetchQueries({
          queryKey: ["shortlistedCount"],
          exact: true,
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["shortlistedCount"] });

        queryClient
          .fetchQuery({
            queryKey: ["shortlistedCount"],
            queryFn: () => api.getShortlistedCount(),
          })
          .catch(() => {
            // fallback handled by invalidateQueries
          });
      }
    },

    retry: 0,
  });
};
