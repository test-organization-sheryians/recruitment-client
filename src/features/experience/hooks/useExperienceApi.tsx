import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";


// --------------------------------------
// GET ALL EXPERIENCES
// --------------------------------------
export const useGetCandidateExperience = (candidateId: string) =>
  useQuery({
    queryKey: ["candidateExperience", candidateId],
    queryFn: () => api.getCandidateExperience(candidateId),
    enabled: !!candidateId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

// --------------------------------------
// GET SINGLE EXPERIENCE
// --------------------------------------
export const useGetSingleExperience = (id: string) =>
  useQuery({
    queryKey: ["singleExperience", id],
    queryFn: () => api.getSingleExperience(id),
    enabled: !!id,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

// --------------------------------------
// CREATE EXPERIENCE
// --------------------------------------
export const useCreateExperience = (options?: any) => {
  
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createExperience"],
    mutationFn: (data: any) => api.createExperience(data),
    

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["candidateExperience", variables.candidateId] });
      options?.onSuccess?.(response);
    },

    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
};

// --------------------------------------
// UPDATE EXPERIENCE
// --------------------------------------
export const useUpdateExperience = (options?: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateExperience"],
    mutationFn: (data: any) => api.updateExperience(data),

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["candidateExperience", variables.candidateId] });
      queryClient.invalidateQueries({ queryKey: ["singleExperience", variables.id] });

      options?.onSuccess?.(response);
    },

    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
};

// --------------------------------------
// DELETE EXPERIENCE
// --------------------------------------
export const useDeleteExperience = (options?: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteExperience"],
    mutationFn: (data: { id: string; candidateId: string }) =>
      api.deleteExperience(data),

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["candidateExperience", variables.candidateId],
      });

      options?.onSuccess?.(response);
    },

    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
};
