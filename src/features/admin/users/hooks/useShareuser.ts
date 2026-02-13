import { createShareCandidate, getShareCandidate, getCandidatesByIds } from '@/api/candidateShare/shareCandidate';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShareCandidate, ShareCandidatePayload } from '../../../../types/shareInterfaceCandidate';

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
  return useQuery<ShareCandidate[]>({
    queryKey: ['share-candidates', shareId],
    queryFn: () => getShareCandidate(shareId),
    enabled: !!shareId,
  });
};

export const useViewCandidates = (userIds: string[]) => {
  return useQuery<ShareCandidate[]>({
    queryKey: ['view-candidates', userIds],
    queryFn: () => getCandidatesByIds(userIds),
    enabled: userIds.length > 0,
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
