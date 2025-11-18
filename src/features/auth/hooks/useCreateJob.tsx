// hooks/useCreateJobRole.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { createJobRole } from "@/api/admin/createjob";
import {getJobRole} from "@/api/admin/getjob"

export const useCreateJobRole = () => {
  return useMutation({
    mutationKey: ["create-job-role"],
    mutationFn: (data: FormData) => createJobRole(data),
    retry: 0,
  });
};

export const useJobRoles = () => {
  return useQuery({
    queryKey: ["job-roles"],
    queryFn: getJobRole,
  });
};