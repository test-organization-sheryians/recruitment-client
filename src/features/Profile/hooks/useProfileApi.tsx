import { useQuery, useMutation } from "@tanstack/react-query";
import * as api from "../../../api";

import { Profile } from "@/types/profile";

type AnyObject = Record<string, unknown>;
type ProfilePayload = AnyObject | FormData;

// GET PROFILE
export const useGetProfile = (userId?: string) => {
  return useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: () => api.getProfile(),
    retry: 0,
  });
};

// CREATE PROFILE (POST)
export const useCreateProfile = () => {
  return useMutation({
    mutationFn: (data: AnyObject) => api.createProfile(data),
    retry: 0,
  });
};

// UPDATE PROFILE (PUT) — replace entire profile
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: ({ data }: { data: AnyObject }) =>
      api.updateProfile("", data), // keeping call signature stable
    retry: 0,
  });
};

// PATCH PROFILE (partial update)
export const usePatchProfile = () => {
  return useMutation({
    mutationFn: (args: { userId: string; data: ProfilePayload  }) =>
      api.patchProfile(args.userId, args.data),
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
      api.addSkills(data.userId, data.skills),
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
