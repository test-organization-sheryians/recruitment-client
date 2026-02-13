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
  Group,
} from "@/types/shareInterfaceCandidate";

/* =====================================================
   GET ALL GROUPS
===================================================== */
export const useGroups = () => {
  return useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: getAllGroups,
  });
};

/* =====================================================
   DELETE GROUP
===================================================== */
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (groupId: string) => deleteGroup(groupId),
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

  return useMutation<void, Error, UpdateGroupPayload>({
    mutationFn: ({ groupId, newName }) => updateGroupName(groupId, newName),
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

  return useMutation<void, Error, RemoveUserPayload>({
    mutationFn: ({ groupId, userId }) => removeUserFromGroup(groupId, userId),
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

  return useMutation<void, Error, AddUserPayload>({
    mutationFn: ({ groupId, userId }) => addUserToGroup(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};
