import api from "@/config/axios";

export const updateSkill = async (data: any) => {
    const response = await api.put(`api/skills/${data.id}` , {name: data.name});
    console.log(response.data);
    return response.data
}
