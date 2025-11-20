import api from '@/config/axios';

export const addCategory = async () => {
    const response = await api.post("/api/job-categories/");
    return response.data; 
};