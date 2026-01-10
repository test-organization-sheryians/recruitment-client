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
  console.log(`api kaa data hai yee multipal candidate${data}`)
  const response = await api.post('/api/share/', data);
  console.log('check the response ');
  return response.data;
};

export const getShareCandidate = async (): Promise<BackendResponse<ShareCandidate>> => {
  console.log(`api kaa data hai yee multipal candidate call kr rahe hai`);

  const response = await api.get('/api/share/:shareId');

  console.log('check the response of ALL share candidate ===>', response);
  return response.data;
};



// import api from '@/config/axios';

// /* ---------- TYPES ---------- */
// export interface ShareCandidatePayload {
//   candidateId: string;
// }

// export interface ShareCandidate {
//   _id: string;
//   candidateId: string;
//   name?: string;
//   email?: string;
//   createdAt?: string;
// }

// interface BackendResponse<T> {
//   success: boolean;
//   message?: string;
//   data: T[];
// }

// /* ---------- SEND DATA (POST) ---------- */
// /* frontend → backend */
// export const createShareCandidate = async (
//   payload: ShareCandidatePayload[]
// ): Promise<{ success: boolean; shareId: string }> => {
//   const res = await api.post('/api/share/', payload);
//   return res.data;
// };

// /* ---------- RECEIVE DATA (GET) ---------- */
// /* backend → frontend */
// export const getShareCandidate = async (
//   shareId: string
// ): Promise<BackendResponse<ShareCandidate>> => {
//   if (!shareId) throw new Error('shareId required');

//   const res = await api.get(`/api/share/${shareId}`);
//   return res.data;
// };
