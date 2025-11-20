import * as api from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllSkills = () =>
  useQuery({
    queryKey: ["skills"],
    queryFn: api.getAllSkills,
  });

export const useGetSkill = (id?: string) =>
  useQuery({
    queryKey: ["skill", id],
    queryFn: () => api.getSkill(id!),
    enabled: !!id,
  });

export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createSkill"],
    mutationFn: api.createSkill,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["skills"] }),
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateSkill"],
    mutationFn: api.updateSkill,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["skills"] }),
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteSkill"],
        mutationFn: (id: string) => api.deleteSkill(id),   // FIXED ✔
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["skills"] }),
  });
};
