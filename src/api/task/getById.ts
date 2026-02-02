import api from "@/config/axios";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await api.get(`/api/tasks/${id}`);
  return response.data.data;
};
