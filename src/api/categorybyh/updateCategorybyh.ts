import api from '@/config/axios'

export const updateCategorybyh = async ({ id, name }: { id: string; name: string }) => {
    const response = await api.put(`/api/hjob-categories/${id}`, {name});
    return response.data;
}
