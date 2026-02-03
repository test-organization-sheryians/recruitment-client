import api from "@/config/axios";
import { CourseResponse } from "@/types/Pcourse";

export const getAllCourses = async () => {
    // Using the config instance
    const { data } = await api.get<CourseResponse>("/api/prerna/courses");
    return data.data;
};