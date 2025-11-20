import api from "@/config/axios";

export const createSkill = async (data: string) => {
    const response = await api.post("api/skills/" , data);
    console.log(response.data);
    return response.data
}
