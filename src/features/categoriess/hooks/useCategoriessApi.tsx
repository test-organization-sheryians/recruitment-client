import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api/categoriess/addCategoriess";
import { getCategoriess } from "@/api/categoriess/getCategoriess";
import {updateCategoriess} from "@/api/categoriess/updateCategoriess";
/* ---------- READ ---------- */
export const useGetCategoriess = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriess,
    retry: 0,
  });
};

/* ---------- CREATE ---------- */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createCategory"],
    mutationFn: (data: { name: string }) =>
      api.addCategoriess(data),
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};


import * as updateApi from "@/api/categoriess/updateCategoriess";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApi.updateCategoriess,
    onSuccess: () => {
      // 🔥 refresh category list automatically
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
 
import { deleteCategoriess } from "@/api/categoriess/deleteCategoriess";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategoriess,
    onSuccess: () => {
      // 🔥 refresh category list after delete
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};