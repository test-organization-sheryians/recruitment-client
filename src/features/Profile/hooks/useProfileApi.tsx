import { useQuery, useMutation } from "@tanstack/react-query";
import * as api from "../../../api";


// --------------------------------------
// GET PROFILE (Query)
// --------------------------------------
export const useGetProfile = (userId: string) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => api.getProfile(userId),
    enabled: !!userId,
    retry: 0,
  });
};

// --------------------------------------
// CREATE PROFILE
// --------------------------------------
export const useCreateProfile = () => {
  return useMutation({
    mutationKey: ["createProfile"],
    mutationFn: (data: any) => api.createProfile(data),
    retry: 0,
  });
};

// --------------------------------------
// UPDATE PROFILE (PUT)
// --------------------------------------
export const useUpdateProfile = () => {
  return useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: ({ userId, data }: { userId: string; data: any }) =>
      api.updateProfile(userId, data),
    retry: 0,
  });
};

// --------------------------------------
// PATCH PROFILE (partial update)
// --------------------------------------
export const usePatchProfile = () => {
  return useMutation({
    mutationKey: ["patchProfile"],
    mutationFn: ({ userId, data }: { userId: string; data: any }) =>
      api.patchProfile(userId, data),
    retry: 0,
  });
};

// --------------------------------------
// DELETE PROFILE
// --------------------------------------
export const useDeleteProfile = () => {
  return useMutation({
    mutationKey: ["deleteProfile"],
    mutationFn: (userId: string) => api.deleteProfile(userId),
    retry: 0,
  });
};

// --------------------------------------
// ADD SKILLS
// --------------------------------------
export const useAddSkills = () => {
  return useMutation({
    mutationKey: ["addSkills"],
    mutationFn: (data: { userId: string; skills: string[] }) =>
      api.addSkills(data.userId, data.skills),
    retry: 0,
  });
};

// --------------------------------------
// REMOVE SKILL
// --------------------------------------
export const useRemoveSkill = () => {
  return useMutation({
    mutationKey: ["removeSkill"],
    mutationFn: (data: { userId: string; skill: string }) =>
      api.removeSkill(data.userId, data.skill),
    retry: 0,
  });
};
 