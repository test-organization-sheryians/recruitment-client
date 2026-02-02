import api from "@/config/axios";

export interface UpdateTaskPayload {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
}

export const updateTask = async ({ id, ...data }: UpdateTaskPayload) => {
  const response = await api.put(`/api/tasks/update/${id}`, data);
  return response.data;
};
