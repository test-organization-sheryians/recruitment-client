import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "@/api/task/getAll";

export const useGetTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getAllTasks,
    retry: 0,
  });
};
