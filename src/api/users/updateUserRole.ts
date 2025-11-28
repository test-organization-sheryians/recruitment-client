import api from "@/config/axios";

export const updateUserRole = async (id: string, role: string) => {
    const { data } = await api.put(`api/users/${id}/role`, { role });
    return data;
};