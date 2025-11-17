import api from "@/config/axios";

export const deleteSkill = async (data: any) => {
    const response = await api.delete(`api/skills/${data.id}`);
    console.log(response.data);
    return response.data
}
