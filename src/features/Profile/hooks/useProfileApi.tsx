import { useMutation, useQuery,UseMutationOptions,useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";
import { CandidateProfile,AddSkillsPayload  } from "@/types/profile";

// GET
export const useGetProfile = () =>
  useQuery<CandidateProfile>({
    queryKey: ["candidateProfile"],
    queryFn: api.getProfile,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

// CREATE
export const useCreateProfile = () =>
  useMutation({
    mutationKey: ["createProfile"],
    mutationFn: (data: { userId: string }) => api.createProfile(data),
  });

// UPDATE
export const useUpdateProfile = () =>
  useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (data: Partial<CandidateProfile>) => api.updateProfile(data),
  });

// ADD SKILLS
export const useAddSkills = (options?: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addSkills"],
    mutationFn: (data: AddSkillsPayload) => api.addSkills(data),

    onSuccess: (response, variables) => {
  queryClient.setQueryData(["candidateProfile"], (old: any) => {
    if (!old) return old;

    return {
      ...old,
      skills: [...(old.skills || []), ...variables.skills],
    };
  });

  options?.onSuccess?.(response);
},


    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
};
// REMOVE SKILL
export const useRemoveSkill = (options?: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["removeSkill"],
    mutationFn: (skillName: string) => api.removeSkill(skillName),

    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      options?.onSuccess?.(...args);
    },

    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
};


// UPLOAD RESUME
export const useUploadResume = () =>
  useMutation({
    mutationKey: ["uploadResume"],
    mutationFn: (data: FormData) => api.uploadResume(data),
  });

// DELETE RESUME
export const useDeleteResume = () =>
  useMutation({
    mutationKey: ["deleteResume"],
    mutationFn: api.deleteResume,
  });

// UPDATE AVAILABILITY
// export const useUpdateAvailability = () =>
//   useMutation({
//     mutationKey: ["updateAvailability"],
//     mutationFn: (availability: CandidateProfile["availability"]) =>
//       api.updateAvailability({ availability }),
//   });
