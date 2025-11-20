import api from "@/config/axios";

export const getAllSkills = async (data:string) => {
    const response = await api.get("api/skills");
    console.log(response.data);
    return response.data
}

