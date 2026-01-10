import api from '@/config/axios';

interface ShareCandidatePayload {
  candidateId: string;
}

interface ShareCandidate {
  _id: string;
  candidateId: string;
  email?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BackendResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
}

export const createShareCandidate = async (data: ShareCandidatePayload[]) => {
  const response = await api.post('/api/share/', {
    users: data.map(item => item.candidateId),
  });
  console.log('check the response ' + response);
  return response.data;
};

export const getShareCandidate = async (
  shareId: string
): Promise<BackendResponse<ShareCandidate>> => {
  console.log(`api kaa data hai yee multipal candidate call kr rahe hai`);

  const response = await api.get(`/api/share/${shareId}`);

  console.log('check the response of ALL share candidate ===>', response);
  return response.data;
};

// export const getShareCandidate = async (shareId: string) => {
//   const response = await api.get(`/api/share/${shareId}`);
//   console.log('check the response of ALL share candidate ===>', response);
//   return response.data;
// };
