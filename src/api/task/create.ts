import api from "@/config/axios";

export interface CreateTaskPayload {
  title: string;
  description?: string;
}

export const createTask = async (data: CreateTaskPayload) => {
  const response = await api.post("/api/tasks", data);
  return response.data;
};
