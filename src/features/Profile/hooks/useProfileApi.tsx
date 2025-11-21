import { useQuery, useMutation } from "@tanstack/react-query";
import * as api from "../../../api";
import { Profile } from "@/types/profile";

// Type for creating a new profile
type CreateProfileInput = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  skills?: string[];
  experience?: Array<{
    _id?: string;
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  linkedin?: string;
  github?: string;
};

// Type for updating a profile
type UpdateProfileInput = Partial<CreateProfileInput>;

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => api.getProfile(),
    retry: 0,
  });
};

export const useCreateProfile = () => {
  return useMutation({
    mutationFn: (data: CreateProfileInput) => {
      const profileData: Profile = {
        ...data,
        _id: '', // Will be set by the server
        user: {
          _id: data.userId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
        skills: data.skills || [],
        experience: (data.experience || []).map(exp => ({
          ...exp,
          _id: exp._id || `temp-${Math.random().toString(36).substr(2, 9)}`,
          description: exp.description || ''
        }))
      };
      return api.createProfile(profileData);
    },
    retry: 0,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateProfileInput }) => {
      return api.updateProfile(userId, data);
    },
    retry: 0,
  });
};

export const usePatchProfile = () => {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: FormData }) =>
      api.patchProfile(userId, data),
    retry: 0,
  });
};

export const useDeleteProfile = () => {
  return useMutation({
    mutationFn: (userId: string) => api.deleteProfile(userId),
    retry: 0,
  });
};

export const useAddSkills = () => {
  return useMutation({
    mutationFn: ({ userId, skills }: { userId: string; skills: string[] }) =>
      api.addSkills(userId, skills),
    retry: 0,
  });
};

export const useRemoveSkill = () => {
  return useMutation({
    mutationFn: ({ skill }: { skill: string }) => api.removeSkill(skill),
    retry: 0,
  });
};