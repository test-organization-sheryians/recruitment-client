import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteGroup,
  getAllGroups,
  addUserToGroup,
  updateGroupName,
  removeUserFromGroup,
  // createShareCandidate,
} from "@/api/candidateShare/shareCandidate";

import {
  UpdateGroupPayload,
  RemoveUserPayload,
  Group,
  BackendResponse,
} from "@/types/shareInterfaceCandidate";

/* =====================================================
   GET ALL GROUPS
===================================================== */
export const useGroups = () => {
  return useQuery<Group[], Error>({
    queryKey: ["groups"],
    queryFn: async () => {
      const data = await getAllGroups();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
};

/* =====================================================
   DELETE GROUP
===================================================== */
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<BackendResponse<any>, Error, string>({
    mutationFn: async (groupId: string) => {
      return await deleteGroup(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

/* =====================================================
   UPDATE GROUP NAME
===================================================== */
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<BackendResponse<any>, Error, UpdateGroupPayload>({
    mutationFn: async ({ groupId, newName }) => {
      return await updateGroupName(groupId, newName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

/* =====================================================
   REMOVE USER FROM GROUP
===================================================== */
export const useRemoveUserFromGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<BackendResponse<any>, Error, RemoveUserPayload>({
    mutationFn: async ({ groupId, userId }) => {
      return await removeUserFromGroup(groupId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

/* =====================================================
   ADD USER TO GROUP
===================================================== */
export interface AddUserPayload {
  groupId: string;
  userId: string;
}

export const useAddUserToGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<BackendResponse<any>, Error, AddUserPayload>({
    mutationFn: async ({ groupId, userId }) => {
      return await addUserToGroup(groupId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};
