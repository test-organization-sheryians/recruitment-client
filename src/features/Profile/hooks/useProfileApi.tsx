// src/hooks/profile.ts (or wherever you keep it)
import { useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import * as api from "../../../api";

// ========================================
// Types (centralized so you can reuse)
// ========================================

export interface ProfileData {
  name?: string;
  title?: string;
  bio?: string;
  location?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  education?: string[];
  experience?: Array<{
    title: string;
    company: string;
    start: string;
    end: string;
    description: string;
  }>;
  skills?: string[];
  // add any other fields your backend returns/accepts
}

export type CreateProfileVariables = ProfileData;

export type UpdateProfileVariables = {
  userId: string;
  data: Partial<ProfileData>;
};

export type AddSkillsVariables = {
  userId: string;
  skills: string[];
};

export type RemoveSkillVariables = {
  userId: string;
  skill: string;
};

// ========================================
// Hooks
// ========================================

// GET PROFILE
export const useGetProfile = (userId: string) => {
  return useQuery<ProfileData, Error>({
    queryKey: ["profile", userId],
    queryFn: () => api.getProfile(userId),
    enabled: !!userId,
    retry: 0,
  });
};

// CREATE PROFILE
export const useCreateProfile = (): UseMutationResult<
  ProfileData,
  Error,
  CreateProfileVariables
> => {
  return useMutation({
    mutationKey: ["createProfile"],
    mutationFn: (data: CreateProfileVariables) => api.createProfile(data),
    retry: 0,
  });
};

// UPDATE PROFILE (full replace)
export const useUpdateProfile = (): UseMutationResult<
  ProfileData,
  Error,
  UpdateProfileVariables
> => {
  return useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: ({ userId, data }: UpdateProfileVariables) =>
      api.updateProfile(userId, data),
    retry: 0,
  });
};

// PATCH PROFILE (partial update)
export const usePatchProfile = (): UseMutationResult<
  ProfileData,
  Error,
  UpdateProfileVariables
> => {
  return useMutation({
    mutationKey: ["patchProfile"],
    mutationFn: ({ userId, data }: UpdateProfileVariables) =>
      api.patchProfile(userId, data),
    retry: 0,
  });
};

// DELETE PROFILE
export const useDeleteProfile = (): UseMutationResult<
  void,
  Error,
  string
> => {
  return useMutation({
    mutationKey: ["deleteProfile"],
    mutationFn: (userId: string) => api.deleteProfile(userId),
    retry: 0,
  });
};

// ADD SKILLS
export const useAddSkills = (): UseMutationResult<
  ProfileData,
  Error,
  AddSkillsVariables
> => {
  return useMutation({
    mutationKey: ["addSkills"],
    mutationFn: ({ userId, skills }: AddSkillsVariables) =>
      api.addSkills(userId, skills),
    retry: 0,
  });
};

// REMOVE SKILL
export const useRemoveSkill = (): UseMutationResult<
  ProfileData,
  Error,
  RemoveSkillVariables
> => {
  return useMutation({
    mutationKey: ["removeSkill"],
    mutationFn: ({ userId, skill }: RemoveSkillVariables) =>
      api.removeSkill(userId, skill),
    retry: 0,
  });
};