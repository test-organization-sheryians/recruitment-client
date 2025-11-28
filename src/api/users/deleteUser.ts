import api from "@/config/axios";

export const deleteUser = async (id: string) => {
    const { data } = await api.delete(`api/users/${id}`);
    return data;
};