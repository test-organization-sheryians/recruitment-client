import { useQuery, useMutation } from "@tanstack/react-query";
import * as api from "../../../api";
import { updateProfile } from "../../../api";
import { Profile } from "@/types/profile";


type ProfileResponse = {
  success: boolean;
  data: Profile;
};

// GET PROFILE
export const useGetProfile = () => {
  return useQuery<ProfileResponse>({
    queryKey: ["profile"],
    queryFn: () => api.getProfile(),
    
    retry: 0,
  });
};

// CREATE PROFILE (POST)
export const useCreateProfile = () => {
  return useMutation({
    mutationFn: (data: string) => api.createProfile(data),
    retry: 0,
  });
};

// UPDATE PROFILE (PUT) - replace entire profile
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data: Partial<Profile>) => updateProfile(data),
    retry: 0,
  });
};


// PATCH PROFILE (partial update)
// hooks/useProfileApi.tsx
type PatchProfileArgs = {
  userId: string;
  data: Record<string, unknown> | FormData; // allow FormData now
};

export const usePatchProfile = () => {
  return useMutation({
    mutationFn: (args: PatchProfileArgs) => api.patchProfile(args.userId, args.data),
    retry: 0,
  });
};


// DELETE PROFILE
export const useDeleteProfile = () => {
  return useMutation({
    mutationFn: (userId: string) => api.deleteProfile(userId),
    retry: 0,
  });
};

// ADD SKILLS
export const useAddSkills = () => {
  return useMutation({
    mutationFn: (data: { userId: string; skills: string[] }) =>
      api.addSkills(data.userId, data.skills),  // FIX: send userId
    retry: 0,
  });
};

// REMOVE SINGLE SKILL
export const useRemoveSkill = () => {
  return useMutation({
    mutationFn: (data: { skill: string }) =>
      api.removeSkill(data.skill),
    retry: 0,
  });
};

