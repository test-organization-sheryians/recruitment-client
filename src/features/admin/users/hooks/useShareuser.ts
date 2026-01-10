import { createShareCandidate, getShareCandidate } from '@/api/candidateShare/shareCandidate';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface ShareCandidatePayload {
  candidateId: string;
}

interface BackendResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
}

interface ShareCandidate {
  _id: string;
  candidateId: string;
  email?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useCreateShareCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ShareCandidatePayload[]) => createShareCandidate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['share-candidates'],
      });
    },
  });
};

export const useShareCandidates = (shareId: string) => {
  return useQuery({
    queryKey: ['share-candidates', shareId],
    queryFn: () => getShareCandidate(shareId),
    enabled: !!shareId,
  });
};
