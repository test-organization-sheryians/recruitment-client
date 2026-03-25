"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import * as api from "@/api/users/piyushUser.api";
import * as api from "@/api"; 
import { PiyushCreateUserInput } from "@/types/piyushUser";

export const usePiyushGetUsers = () => {
  return useQuery({
    queryKey: ["piyush-users"],
    queryFn: api.piyushGetUsers,
  });
};

export const usePiyushCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["piyush-create-user"],
    mutationFn: (data: PiyushCreateUserInput) =>
      api.piyushCreateUser(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["piyush-users"] }); // 🔥 FIX
    },

    retry: 0,
  });
};

export const usePiyushDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["piyush-delete-user"],
    mutationFn: (id: string) => api.piyushDeleteUser(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["piyush-users"] }); // 🔥 FIX
    },

    retry: 0,
  });
};

// 👉 UPDATE USER
export const usePiyushUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["piyush-update-user"],
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<PiyushCreateUserInput>;
    }) => api.piyushUpdateUser(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["piyush-users"] }); // 🔥 FIX
    },

    retry: 0,
  });
};