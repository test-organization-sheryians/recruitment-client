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

    onSuccess: (response) => {
      console.debug("bulkUpdate response:", response);
      // response is `response.data` from the API. If server returned counts, apply them directly.
      const counts = response?.counts;

      // Refresh applicant lists
      queryClient.invalidateQueries({ queryKey: ["jobApplicant"] });

      if (counts) {
        // update cached shortlisted count immediately (use updater to ensure notification)
        queryClient.setQueryData(["shortlistedCount"], () => {
          return counts;
        });

        // ensure queries subscribed to this key refetch (gets server-authoritative value)
        queryClient.refetchQueries({ queryKey: ["shortlistedCount"], exact: true });
      } else {
        // fallback: invalidate and refetch the shortlistedCount query
        queryClient.invalidateQueries({ queryKey: ["shortlistedCount"] });
        queryClient.refetchQueries({ queryKey: ["shortlistedCount"] });
      }
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