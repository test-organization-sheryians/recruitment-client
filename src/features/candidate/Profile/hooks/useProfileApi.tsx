import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import * as api from "@/api";
import { CandidateProfile } from "@/types/profile";
import { User } from "@/lib/auth";

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
export const useUpdateProfile1 = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["candidateProfile"],
    mutationFn: (payload: api.UpdateProfilePayload) => api.updateProfile(payload), // Direct call – perfect match!
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["candidateProfile"]
      })
    }
  })
}


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

export const useUpdateAvailability = () =>
  useMutation({
    mutationKey: ["updateAvailability"],
    mutationFn: (availability: CandidateProfile["availability"]) =>
      api.updateAvailability(availability),
  });

// GET USER
export const useGetUser = (): UseQueryResult<User, Error> =>
  useQuery<User, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      if (!response.ok) throw new Error("Failed to fetch user");
      const data = await response.json();
      return data.user;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

// UPDATE USER
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateUser"],
    mutationFn: (updates: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
    }) => api.updateUser(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};
