import api from '@/config/axios'

export const getCategoriesbyh = async () => {
    const response = await api.get("/api/hjob-categories")
    return response?.data?.data || [];
} 