import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "@/api";

// ---------------- GET PROFILE ----------------
export const useGetProfile = () => {
  return useQuery({
    queryKey: ["candidateProfile"],
    queryFn: api.getProfile,
    retry: 0,
  });
};

// ---------------- CREATE PROFILE ----------------
export const useCreateProfile = () => {
  return useMutation({
    mutationKey: ["createProfile"],
    mutationFn: (data: any) => api.createProfile(data),
    retry: 0,
  });
};

// ---------------- UPDATE PROFILE ----------------
export const useUpdateProfile = () => {
  return useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (data: any) => api.updateProfile(data),
    retry: 0,
  });
};

// ---------------- ADD SKILLS ----------------
export const useAddSkills = () => {
  return useMutation({
    mutationKey: ["addSkills"],
    mutationFn: (skills: string[]) => api.addSkills(skills),
    retry: 0,
  });
};

// ---------------- REMOVE SKILL ----------------
export const useRemoveSkill = () => {
  return useMutation({
    mutationKey: ["removeSkill"],
    mutationFn: (skillName: string) => api.removeSkill(skillName),
    retry: 0,
  });
};

// ---------------- UPLOAD RESUME ----------------
export const useUploadResume = () => {
  return useMutation({
    mutationKey: ["uploadResume"],
    mutationFn: (data: FormData) => api.uploadResume(data),
    retry: 0,
  });
};

// ---------------- DELETE RESUME ----------------
export const useDeleteResume = () => {
  return useMutation({
    mutationKey: ["deleteResume"],
    mutationFn: () => api.deleteResume(),
    retry: 0,
  });
};

// ---------------- UPDATE AVAILABILITY ----------------
export const useUpdateAvailability = () => {
  return useMutation({
    mutationKey: ["updateAvailability"],
    mutationFn: (availability: string) =>
      api.updateAvailability(availability),
    retry: 0,
  });
};
