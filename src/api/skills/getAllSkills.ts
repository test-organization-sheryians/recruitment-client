import api from "@/config/axios";

export const getAllSkills = async (data: any) => {
    const response = await api.get("api/skills");
    console.log(response.data);
    return response.data
}

