import api from "@/config/axios";

// export interface getUserAttemptsPayload {
//     id: string;
// }

export const getUserAttempts = async (id: string) => {
  const response = await api.get(`api/test-attempts/user/${id}`);

  
  return response.data.data;
};