import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import * as api from "@/api";
import { CandidateProfile, AddSkillsPayload } from "@/types/profile";

// GET
export const useGetProfile = (): UseQueryResult<CandidateProfile, Error> =>
  useQuery<CandidateProfile, Error>({
    queryKey: ["candidateProfile"],
    queryFn: api.getProfile,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

// CREATE
export const useCreateProfile = () =>
  useMutation({
    mutationKey: ["createProfile"],
    mutationFn: (userId: string) => api.createProfile(userId), // Changed to accept string directly
  });

// UPDATE
export const useUpdateProfile = () =>
  useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (profileData: string) => api.updateProfile(profileData), // Changed to accept string directly
  });

// ADD SKILLS
interface AddSkillsOptions {
  onSuccess?: (data: unknown, variables: AddSkillsPayload, context: unknown) => void;
  onError?: (error: Error, variables: AddSkillsPayload, context: unknown) => void;
}

export const useAddSkills = (options?: AddSkillsOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addSkills"],
    mutationFn: (data: AddSkillsPayload) => api.addSkills(data),

    onSuccess: (data: unknown, variables: AddSkillsPayload, context: unknown) => {
      queryClient.setQueryData(["candidateProfile"], (old: CandidateProfile | undefined): CandidateProfile | undefined => {
        if (!old) return old;

        return {
          ...old,
          skills: [...(old.skills || []), ...variables.skills],
        };
      });

      options?.onSuccess?.(data, variables, context);
    },

    onError: (error: Error, variables: AddSkillsPayload, context: unknown) => {
      options?.onError?.(error, variables, context);
    },
  });
};

// REMOVE SKILL
interface RemoveSkillOptions {
  onSuccess?: (data: unknown, variables: string, context: unknown) => void;
  onError?: (error: Error, variables: string, context: unknown) => void;
}

export const useRemoveSkill = (options?: RemoveSkillOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["removeSkill"],
    mutationFn: (skillName: string) => api.removeSkill(skillName),

    onSuccess: (data: unknown, variables: string, context: unknown) => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      options?.onSuccess?.(data, variables, context);
    },

    onError: (error: Error, variables: string, context: unknown) => {
      options?.onError?.(error, variables, context);
    },
  });
};

// UPLOAD RESUME
export const useUploadResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["uploadResume"],
    mutationFn: (data: FormData) => api.uploadResume(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
    },
  });
};

// DELETE RESUME
export const useDeleteResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteResume"],
    mutationFn: () => api.deleteResume(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
    },
  });
};

// UPDATE AVAILABILITY
export const useUpdateAvailability = () =>
  useMutation({
    mutationKey: ["updateAvailability"],
    mutationFn: (availability: CandidateProfile["availability"]) =>
      api.updateAvailability(availability),
  });