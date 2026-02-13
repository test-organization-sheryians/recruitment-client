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

export const getCandidatesByIds = async (userIds: string[]): Promise<ShareCandidate[]> => {
  try {
    // Use the share endpoint to get candidate data without creating a public share
    const response = await api.post('/api/share/', {
      users: userIds,
    });
    
    // Get the shareId from the response
    const shareId = response.data.shareLink.split('/').pop();
    
    // Fetch the candidates from the share
    const candidatesResponse = await api.get(`/api/share/${shareId}`);
    console.log('View candidates data ==>', candidatesResponse.data.data);
    return candidatesResponse.data.data;
  } catch (error) {
    console.error('Error fetching candidates by IDs:', error);
    throw error;
  }
};
