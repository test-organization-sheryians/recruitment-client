import api from "@/config/axios";

export const getSkill = async (data: any) => {
    const response = await api.get(`api/skills/${data.id}`);
    console.log(response.data);
    return response.data
}
