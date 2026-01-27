"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentApi } from "../Service/department.api";
import { Department, CreateDepartmentPayload } from "../Types/department.types";

/**
 * Fetch all departments
 */
export const useDepartments = () => {
  const queryClient = useQueryClient();

  // GET departments
  const departmentsQuery = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: departmentApi.getDepartments,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // CREATE department
  const createDepartment = useMutation({
    mutationFn: (payload: CreateDepartmentPayload) =>
      departmentApi.createDepartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  // UPDATE department
  const updateDepartment = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateDepartmentPayload }) =>
      departmentApi.updateDepartment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  // DELETE department
  const deleteDepartment = useMutation({
    mutationFn: (id: string) => departmentApi.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  return {
    departments: departmentsQuery.data ?? [],
  isLoading: departmentsQuery.isLoading,

  createDepartment: createDepartment.mutateAsync,
  updateDepartment: updateDepartment.mutateAsync,
  deleteDepartment: deleteDepartment.mutateAsync,
  };
};