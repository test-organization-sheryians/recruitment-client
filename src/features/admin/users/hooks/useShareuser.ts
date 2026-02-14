import { createShareCandidate, getShareCandidate } from '@/api/candidateShare/shareCandidate';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShareCandidate, ShareCandidatePayload } from '../../../../types/shareInterfaceCandidate';

interface CreateShareCandidateArgs {
  groupName: string;
  users: ShareCandidatePayload[];
}

export const useCreateShareCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupName, users }: CreateShareCandidateArgs) =>
      createShareCandidate(groupName, users),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['groups'],
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

