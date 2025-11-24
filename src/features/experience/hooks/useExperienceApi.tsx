import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";
import { CreateExperiencePayload } from "@/api";
import { ExperienceItem } from "@/types/ExperienceItem ";
import { getSingleExperience } from "@/api/experience/getSingleExperience";

// --------------------------------------
// GET ALL EXPERIENCES
// --------------------------------------
export const useGetCandidateExperience = (candidateId?: string) =>
  useQuery<{ data: ExperienceItem[] }, Error>({
    queryKey: ["candidateExperience", candidateId],
    queryFn: () => api.getCandidateExperience(candidateId!),
    enabled: !!candidateId,
  });

// --------------------------------------
// GET SINGLE EXPERIENCE
// --------------------------------------
export const useGetSingleExperience = (id: string) =>
  useQuery<ExperienceItem, Error>({
    queryKey: ["singleExperience", id],
    queryFn: () => getSingleExperience({ id }),
    enabled: !!id,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

// --------------------------------------
// CREATE EXPERIENCE
// --------------------------------------
interface CreateExperienceOptions {
  onSuccess?: (data: ExperienceItem) => void;
  onError?: (error: unknown) => void;
}

export const useCreateExperience = (options?: CreateExperienceOptions) => {
  const queryClient = useQueryClient();

  return useMutation<ExperienceItem, unknown, CreateExperiencePayload>({
    mutationKey: ["createExperience"],
    mutationFn: (data) => api.createExperience(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["candidateExperience"] });
      options?.onSuccess?.(response);
    },
    onError: (error: unknown) => {
      options?.onError?.(error);
    },
  });
};

// --------------------------------------
// UPDATE EXPERIENCE
// --------------------------------------
export interface UpdateExperienceVariables extends Partial<Omit<ExperienceItem, "_id">> {
  id: string;           // required for URL
  candidateId?: string; // optional for query invalidation
}

interface UpdateExperienceOptions {
  onSuccess?: (data: ExperienceItem) => void;
  onError?: (error: unknown) => void;
}

export const useUpdateExperience = (options?: UpdateExperienceOptions) => {
  const queryClient = useQueryClient();

  return useMutation<ExperienceItem, unknown, UpdateExperienceVariables>({
    mutationKey: ["updateExperience"],
    mutationFn: (data: UpdateExperienceVariables) => api.updateExperience(data), // fully typed
    onSuccess: (response, variables) => {
      if (variables.candidateId) {
        queryClient.invalidateQueries({ queryKey: ["candidateExperience", variables.candidateId] });
      }
      queryClient.invalidateQueries({ queryKey: ["singleExperience", variables.id] });
      options?.onSuccess?.(response);
    },
    onError: (error: unknown) => {
      options?.onError?.(error);
    },
  });
};



// --------------------------------------
// DELETE EXPERIENCE
// --------------------------------------
export interface DeleteExperienceVariables {
  id: string;
  candidateId: string;
}

interface DeleteExperienceOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}

export const useDeleteExperience = (options?: DeleteExperienceOptions) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, DeleteExperienceVariables>({
    mutationKey: ["deleteExperience"],
    mutationFn: (data) => api.deleteExperience(data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["candidateExperience", variables.candidateId] });
      options?.onSuccess?.(response);
    },
    onError: (error: unknown) => {
      options?.onError?.(error);
    },
  });
};
