import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteGroup,
  getAllGroups,
  addUserToGroup,
  updateGroupName,
  removeUserFromGroup,
} from "@/api/candidateShare/shareCandidate";

import {
  UpdateGroupPayload,
  RemoveUserPayload,
  AddUserPayload,
  Group,
  ShareResponse,
} from "@/types/shareInterfaceCandidate";

/* =====================================================
   QUERY KEYS (Centralized Management)
===================================================== */
export const groupKeys = {
  all: ['groups'] as const,
  lists: () => [...groupKeys.all, 'list'] as const,
  list: (filters?: object) => [...groupKeys.lists(), { ...(filters || {}) }] as const,
  details: () => [...groupKeys.all, 'detail'] as const,
  detail: (id: string) => [...groupKeys.details(), id] as const,
  members: (id: string) => [...groupKeys.detail(id), 'members'] as const,
};

/* =====================================================
   GET ALL GROUPS
===================================================== */
export const useGroups = () => {
  return useQuery<Group[], Error>({
    queryKey: groupKeys.lists(), // Updated from hardcoded string
    queryFn: async () => {
      const data = await getAllGroups();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/* =====================================================
   DELETE GROUP
===================================================== */
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<ShareResponse, Error, string>({
    mutationFn: async (groupId: string) => {
      return await deleteGroup(groupId);
    },
    onSuccess: () => {
      // Invalidate everything under 'groups'
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
};

/* =====================================================
   UPDATE GROUP NAME
===================================================== */
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<ShareResponse, Error, UpdateGroupPayload>({
    mutationFn: async ({ groupId, newName }) => {
      return await updateGroupName(groupId, newName);
    },
    onSuccess: (_, variables) => {
      // Refresh the specific group detail and the general list
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.groupId) });
    },
  });
};

/* =====================================================
   REMOVE USER FROM GROUP
===================================================== */
export const useRemoveUserFromGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<ShareResponse, Error, RemoveUserPayload>({
    mutationFn: async ({ groupId, userId }) => {
      return await removeUserFromGroup(groupId, userId);
    },
    onSuccess: (_, variables) => {
      // Specifically invalidate members of this group for instant UI update
      queryClient.invalidateQueries({ queryKey: groupKeys.members(variables.groupId) });
      // Also refresh the main list to keep everything in sync
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
};

/* =====================================================
   ADD USER TO GROUP
===================================================== */
export const useAddUserToGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<ShareResponse, Error, AddUserPayload>({
    mutationFn: async ({ groupId, userId }) => {
      return await addUserToGroup(groupId, userId);
    },
    onSuccess: (_, variables) => {
      // Fix for point 3.1.5: Refresh specific members cache
      queryClient.invalidateQueries({ queryKey: groupKeys.members(variables.groupId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
};