import api from "@/config/axios";
import { ICourse } from "@/types/Pcourse";

// We pick specific fields so we don't send ID or CreatedAt
export const createCourse = async (newCourse: Pick<ICourse, "title" | "price" | "description">) => {
    const { data } = await api.post("/api/prerna/courses", newCourse);
    return data;
};