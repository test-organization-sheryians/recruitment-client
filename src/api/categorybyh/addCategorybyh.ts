import api from '@/config/axios'

export const addCategorybyh = async (data: { name: string }) => {
    const response = await api.post("/api/hjob-categories/", data)
    return response?.data;
}