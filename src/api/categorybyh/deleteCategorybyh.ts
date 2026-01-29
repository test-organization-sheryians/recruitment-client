import api from '@/config/axios'

export const deleteCategorybyh = async (id: string) => {
    const response = await api.delete(`/api/hjob-categories/${id}`);
    return response.data;
}