import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import * as api from "@/api";
import { CandidateProfile,} from "@/types/profile";

// GET
export const useGetProfile = (): UseQueryResult<CandidateProfile, Error> =>
  useQuery<CandidateProfile, Error>({
    queryKey: ["candidateProfile"],
    queryFn: api.getProfile,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });


// CREATE
export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createProfile"],
    mutationFn: (userId: string) => api.createProfile(userId), // Changed to accept string directly
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
    },
  });
};



// UPDATE
export const useUpdateProfile1 = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["candidateProfile"],
    mutationFn: (payload: api.UpdateProfilePayload) =>
      api.updateProfile(payload), // Direct call – perfect match!
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
    },
  });
};

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

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateAvailability"],
    mutationFn: (availability: CandidateProfile["availability"]) =>
      api.updateAvailability(availability),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
    },
  });
};

// UPDATE USER INFO (firstName, lastName, phoneNumber)
export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateMe"],
    mutationFn: (data: api.UpdateMeInput) => api.updateMe(data),
    onSuccess: () => {
      // Invalidate both candidate profile and auth user to sync updates
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
};
