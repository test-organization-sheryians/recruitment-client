import api from '@/config/axios';

export const getCategories = async () => {
    const response = await api.get("/api/job-categories/");
    return response.data?.data || [];
};
