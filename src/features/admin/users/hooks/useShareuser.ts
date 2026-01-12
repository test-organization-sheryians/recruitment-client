import { createShareCandidate, getShareCandidate } from '@/api/candidateShare/shareCandidate';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface ShareCandidatePayload {
  candidateId: string;
}
interface Skill {
  _id?: string;
  name?: string;
}

interface Experience {
  _id?: string;
  company?: string;
  role?: string;
}
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ShareCandidate {
  _id: string;
  userId: string;
  availability: 'looking' | 'not_looking';
  resumeFile?: string;
  createdAt: string;
  updatedAt: string;

  user: User;
  skills: Skill[];
  experiences: Experience[];
}

interface BackendResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
}
interface CreateShareCandidateResponse {
  message: string;
  shareLink: string;
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
  return useQuery<ShareCandidate[]>({
    queryKey: ['share-candidates', shareId],
    queryFn: () => getShareCandidate(shareId),
    enabled: !!shareId,
  });
};
