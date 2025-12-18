import { QueryClient, useMutation, useQuery, useQueryClient  } from "@tanstack/react-query";
import { createSkill } from "@/api/skills/createSkill";
import { getAllSkills } from "@/api/skills/getAllSkills"
import { deleteSkill } from "@/api/skills/deleteSkill"
import api from "@/config/axios";



export const useGetAllSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: () => api.getAllSkills(),
    retry: 0,
  });
};

export const useGetSkill = (id?: string) => {
  return useQuery({
    queryKey: ["skill", id],
    queryFn: () => api.getSkill(\id!),
    enabled: !!id,
    retry: 0
  });
};
 
const invalidateSkills = (queryClient:QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["skills"] });
  queryClient.invalidateQueries({ queryKey: ["skill"] });
};

export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createSkill"],
    mutationFn: (data: { name: string }) => api.createSkill(data),
    retry: 0,
    onSuccess: () => invalidateSkills(queryClient),
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateSkill"],
    mutationFn: (data: { id: string; name: string }) => api.updateSkill(data),
    retry: 0,
    onSuccess: () => invalidateSkills(queryClient),
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteSkill"],
    mutationFn: (id: string) => api.deleteSkill(id),
    retry: 0,
    onSuccess: () => invalidateSkills(queryClient),
  });
};