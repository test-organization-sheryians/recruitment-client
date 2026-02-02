import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/api/task/update";

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateTask"],
    mutationFn: updateTask,
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
