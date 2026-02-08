import api from '@/config/axios';

export const addCategory = async (data: { name: string }) => {
    const response = await api.post("/api/job-categories/", data);
    return response.data;
};