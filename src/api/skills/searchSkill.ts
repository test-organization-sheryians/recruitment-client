import api from "@/config/axios";

export const searchSkill = async (query: string) => {
            const { data } = await api.get(`api/skills/search`, {
                        params: { name: query }
            });
            return data.skills;
};