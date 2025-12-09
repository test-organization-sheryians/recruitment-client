import api from "@/config/axios";

export interface getUserAttemptsPayload {
    id: string;
}

export const getUserAttempts = async (data: getUserAttemptsPayload) => {
    const response = await api.get(`api/test-attempts/user/${data.id}`)
    return response.data;
}