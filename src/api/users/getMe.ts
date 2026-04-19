import api from "@/config/axios";

export interface UserRole {
  _id: string;
  name: string;
  description: string;
}

export interface GetMeResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    role: UserRole | null;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
}

export const getMe = async (): Promise<GetMeResponse> => {
  const response = await api.get<GetMeResponse>("/api/users/me");
  console.log(response)
  return response.data;
};
