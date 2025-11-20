import api from '@/config/axios';

export const deleteCategory = async (id: string) => {
    const response = await api.delete(`/api/job-categories/${id}`);
    return response.data;
};