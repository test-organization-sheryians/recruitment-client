import api from '@/config/axios';

export const updateCategory = async ({ id, name }: { id: string; name: string }) => {
    const response = await api.put(`/api/job-categories/${id}`, { name });
    return response.data;
};