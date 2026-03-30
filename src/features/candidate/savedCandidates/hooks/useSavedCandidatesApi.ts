import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  saveCandidate,
  getSavedCandidates,
  getSavedCandidateStatus,
  removeSavedCandidate,
} from "@/api/candidate/savedCandidates";

/**
 * Hook to save a candidate
 */
export const useSaveCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (candidateId: string) => saveCandidate(candidateId),
    onSuccess: () => {
      // Invalidate and refetch the saved candidates list
      queryClient.invalidateQueries({ queryKey: ["savedCandidates"] });
    },
  });
};

/**
 * Hook to get all saved candidates
 */
export const useGetSavedCandidates = () => {
  return useQuery({
    queryKey: ["savedCandidates"],
    queryFn: () => getSavedCandidates(),
    enabled: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to check if a candidate is saved
 */
export const useSavedCandidateStatus = (candidateId: string) => {
  return useQuery({
    queryKey: ["savedCandidateStatus", candidateId],
    queryFn: () => getSavedCandidateStatus(candidateId),
    enabled: false,
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Hook to remove a saved candidate
 */
export const useRemoveSavedCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (candidateId: string) => removeSavedCandidate(candidateId),
    onSuccess: () => {
      // Invalidate and refetch the saved candidates list
      queryClient.invalidateQueries({ queryKey: ["savedCandidates"] });
      // Invalidate all status queries
      queryClient.invalidateQueries({ queryKey: ["savedCandidateStatus"] });
    },
  });
};
