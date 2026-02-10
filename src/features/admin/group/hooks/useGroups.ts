import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api/Groups/group.api";

export const useGroups = () =>
  useQuery({
    queryKey: ["groups"],
    queryFn: api.getGroups,
  });

export const useCreateGroup = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.createGroup,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

export const useDeleteGroup = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.deleteGroup,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};
