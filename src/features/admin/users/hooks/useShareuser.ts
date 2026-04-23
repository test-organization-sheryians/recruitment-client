import {
  createShareCandidate,
  getShareCandidate,
} from "@/api/candidateShare/shareCandidate";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  ShareCandidate,
  ShareMutationPayload,
  ShareResponse,
  ShareCandidatePayload,
} from "@/types/shareInterfaceCandidate";

/* =====================================================
   CREATE SHARE CANDIDATE / CREATE GROUP
===================================================== */

export const useCreateShareCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation<ShareResponse, Error, ShareMutationPayload>({
    mutationFn: async (payload) => {
      /**
       * payload can be:
       * 1. ShareCandidatePayload[]
       * 2. { groupName, users }
       */

      // Direct share (array)
      if (Array.isArray(payload)) {
        return createShareCandidate("", payload);
      }

      // Group creation
      return createShareCandidate(payload.groupName, payload.users);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
  });
};

/* =====================================================
   GET SHARED CANDIDATES
===================================================== */



export const useShareCandidates = (shareId: string) => {
  return useQuery({
    queryKey: ['shareCandidates', shareId],
    queryFn: () => getShareCandidate(shareId), // Ensure this calls the service
    enabled: !!shareId,
    retry: 1,
  });
};