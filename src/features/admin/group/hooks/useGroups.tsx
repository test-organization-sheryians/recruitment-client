import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api/group/group.api";

/* GET ALL */
export const useGroups = () =>
  useQuery({
    queryKey: ["groups"],
    queryFn: api.getGroups,
  });

/* GET ONE */
export const useGroupDetail = (groupId: string) =>
  useQuery({
    queryKey: ["group", groupId],
    queryFn: () => api.getGroupById(groupId),
    enabled: !!groupId,
  });

/* CREATE */
export const useCreateGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createGroup,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

/* UPDATE */
export const useUpdateGroup = (groupId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { groupName?: string }) =>
      api.updateGroup(groupId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["group", groupId] });
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

/* DELETE */
export const useDeleteGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteGroup,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

/* ADD USER */
export const useAddUser = (groupId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      api.addUserToGroup(groupId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
};

/* REMOVE USER */
export const useRemoveUser = (groupId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      api.removeUserFromGroup(groupId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
};
