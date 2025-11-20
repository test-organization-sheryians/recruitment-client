import api from "@/config/axios";

export const deleteSkill = async (id: string) => {
    const response = await api.delete(`api/skills/${id}}`);
    console.log(response.data);
    return response.data
}
