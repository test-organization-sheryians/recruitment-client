import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/api/task/create";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTask"],
    mutationFn: createTask,
    retry: 0,
    onSuccess: () => {
      // future-proof: when list API comes
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
