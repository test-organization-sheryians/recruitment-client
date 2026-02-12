import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteGroup,
  getAllGroups,
  addUserToGroup,
  updateGroupName,
  removeUserFromGroup,
} from "@/api/candidateShare/shareCandidate";
import { UpdateGroupPayload,RemoveUserPayload } from "@/types/shareInterfaceCandidate";
/* ================= GET ALL GROUPS ================= */

export const useGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: getAllGroups,
  });
};

/* ================= DELETE GROUP ================= */

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};



/* ================= UPDATE GROUP NAME ================= */



export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, newName }: UpdateGroupPayload) =>
      updateGroupName(groupId, newName),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

/* ================= REMOVE USER FROM GROUP ================= */


export const useRemoveUserFromGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userId }: RemoveUserPayload) =>
      removeUserFromGroup(groupId, userId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

/* ================= ADD USER TO GROUP ================= */
export const useAddUserToGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      userId,
    }: {
      groupId: string;
      userId: string;
    }) => addUserToGroup(groupId, userId),

    onSuccess: () => {
      // groups + member count refresh
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['share-candidates'] });
    },
  });
};
