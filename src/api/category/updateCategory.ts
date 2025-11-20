import api from '@/config/axios';

export const updateCategory = async () => {
    const response = await api.post("/api/job-categories/");
    return response.data; 
};