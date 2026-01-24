import api from '@/config/axios';
import { ShareCandidate, ShareCandidatePayload } from '../../types/shareInterfaceCandidate';

export const createShareCandidate = async (data: ShareCandidatePayload[]) => {
  const response = await api.post('/api/share/', {
    users: data.map(item => item.candidateId),
  });
  console.log(
    'check the data send from frontend to backend  => ',
    response,
    'response.data => ',
    response.data
  );
  return response.data;
};

export const getShareCandidate = async (shareId: string): Promise<ShareCandidate[]> => {
  const response = await api.get(`/api/share/${shareId}`);
  console.log(
    'backend response of ALL share candidates ===>',
    response,
    'response.data.data ===>',
    response.data.data
  );
  return response.data.data;
};
