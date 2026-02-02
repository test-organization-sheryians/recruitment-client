import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/api/task/delete";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteTask"],
    mutationFn: (id: string) => deleteTask(id),
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
