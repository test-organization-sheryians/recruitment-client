import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "@/api";

export const useCreateJobRole = () => {
  return useMutation({
    mutationKey: ["createJobRole"],
    mutationFn: (data:FormData) => api.createJobRole(data),
    retry: 0,
  });
};

export const useGetAllJobRoles = () => {
  return useQuery({
    queryKey: ["getAllJobRoles"],
    queryFn: api.getAllJobRoles,
    retry: 0,
  });
};

export const useGetJobRoleById = (id:string) => {
  return useQuery({
    queryKey: ["getJobRoleById", id],
    queryFn: () => api.getJobRoleById(id),
    enabled: !!id,
    retry: 0,
  });
};

export const useUpdateJobRole = () => {
  return useMutation({
    mutationKey: ["updateJobRole"],
    mutationFn: ({ id , data }) => api.updateJobRole(id, data),
    retry: 0,
  });
};

export const useDeleteJobRole = () => {
  return useMutation({
    mutationKey: ["deleteJobRole"],
    mutationFn: (id:string) => api.deleteJobRole(id),
    retry: 0,
  });
};

export const useJobRolesByClient = (clientId:string) => {
  return useQuery({
    queryKey: ["jobRolesByClient", clientId],
    queryFn: () => api.getJobRolesByClient(clientId),
    enabled: !!clientId,
    retry: 0,
  });
};

export const useJobRolesByCategory = (categoryId:string) => {
  return useQuery({
    queryKey: ["jobRolesByCategory", categoryId],
    queryFn: () => api.getJobRolesByCategory(categoryId),
    enabled: !!categoryId,
    retry: 0,
  });
};

export const useActiveJobRoles = () => {
  return useQuery({
    queryKey: ["activeJobRoles"],
    queryFn: api.getActiveJobRoles,
    retry: 0,
  });
};

export const useExpiredJobRoles = () => {
  return useQuery({
    queryKey: ["expiredJobRoles"],
    queryFn: api.getExpiredJobRoles,
    retry: 0,
  });
};

export const useCreateJobCategory = () => {
  return useMutation({
    mutationKey: ["createJobCategory"],
    mutationFn: (data) => api.createJobCategory(data),
    retry: 0,
  });
};

export const useGetAllJobCategories = () => {
  return useQuery({
    queryKey: ["getAllJobCategories"],
    queryFn: api.getAllJobCategories,
    retry: 0,
  });
};

export const useGetJobCategoryById = (id:string) => {
  return useQuery({
    queryKey: ["getJobCategoryById", id],
    queryFn: () => api.getJobCategoryById(id),
    enabled: !!id,
    retry: 0,
  });
};

export const useUpdateJobCategory = () => {
  return useMutation({
    mutationKey: ["updateJobCategory"],
    mutationFn: ({ id, data}) => api.updateJobCategory(id, data),
    retry: 0,
  });
};

export const useDeleteJobCategory = () => {
  return useMutation({
    mutationKey: ["deleteJobCategory"],
    mutationFn: (id:string) => api.deleteJobCategory(id),
    retry: 0,
  });
};
export default {
  useCreateJobRole,
  useGetAllJobRoles,
  useGetJobRoleById,
  useUpdateJobRole,
  useDeleteJobRole,
  useJobRolesByClient,
  useJobRolesByCategory,
  useActiveJobRoles,
  useExpiredJobRoles,
  useCreateJobCategory,
  useGetAllJobCategories,
  useGetJobCategoryById,
  useUpdateJobCategory,
  useDeleteJobCategory,
};
