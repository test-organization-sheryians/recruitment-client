import api from "@/config/axios";

export const deleteCourse = async (id: string) => {
    const { data } = await api.delete(`/api/prerna/courses/${id}`);
    return data;
};