import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "@/api";
import { CandidateProfile,AddSkillsPayload  } from "@/types/profile";

// GET
export const useGetProfile = () =>
  useQuery<CandidateProfile>({
    queryKey: ["candidateProfile"],
    queryFn: api.getProfile,
    retry: 0,
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
export const useAddSkills = () =>
  useMutation({
    mutationKey: ["addSkills"],
    mutationFn: (data: AddSkillsPayload) => api.addSkills(data),
  });

// REMOVE SKILL
export const useRemoveSkill = () =>
  useMutation({
    mutationKey: ["removeSkill"],
    mutationFn: (skillName: string) => api.removeSkill(skillName),
  });

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
