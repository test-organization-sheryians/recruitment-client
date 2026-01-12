import api from '@/config/axios';

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
export const createShareCandidate = async (data: ShareCandidatePayload[]) => {
  const response = await api.post('/api/share/', {
    users: data.map(item => item.candidateId),
  });
  console.log('check the response ' + response);
  return response.data;
};

export const getShareCandidate = async (shareId: string): Promise<ShareCandidate[]> => {
  const response = await api.get(`/api/share/${shareId}`);
  console.log('check the response of ALL share candidate ===>', response);
  return response.data.data;
};
