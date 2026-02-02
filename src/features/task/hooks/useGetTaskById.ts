import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "@/api/task/getById";

export const useGetTaskById = (id?: string) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskById(id!),
    enabled: !!id, // IMPORTANT
    retry: 0,
  });
};
