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



<<<<<<< HEAD

=======
>>>>>>> 052aaa9e5bdfd3cb1cbe6dac7d9c6ea8ec25d984
export const useBulkUpdateApplicants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: api.BulkUpdatePayload) =>
<<<<<<< HEAD
      api.bulkUpadteData(payload),
=======
      api.bulkUpdateData(payload),
>>>>>>> 052aaa9e5bdfd3cb1cbe6dac7d9c6ea8ec25d984

    onSuccess: () => {
      // 🔁 refetch applicants after update
      queryClient.invalidateQueries({
        queryKey: ["jobApplicant"],
      });
    },

    retry: 0,
  });

<<<<<<< HEAD
}
=======
}
>>>>>>> 052aaa9e5bdfd3cb1cbe6dac7d9c6ea8ec25d984
