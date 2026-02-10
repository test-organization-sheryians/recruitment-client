import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api/Groups/group.api";

export const useGroupDetail = (groupId: string) =>
  useQuery({
    queryKey: ["group", groupId],
    queryFn: () => api.getGroupById(groupId),
    enabled: !!groupId,
  });

export const useUpdateGroup = (groupId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.updateGroup(groupId, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["group", groupId] }),
  });
};
