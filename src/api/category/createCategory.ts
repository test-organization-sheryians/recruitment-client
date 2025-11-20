import api from '@/config/axios';

export const createCategory = async () => {
    const response = await api.post("/api/job-categories/");
    return response.data; 
};