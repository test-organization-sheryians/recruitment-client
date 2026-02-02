import api from "@/config/axios";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

export const getAllTasks = async (): Promise<Task[]> => {
  const response = await api.get("/api/tasks");
  return response.data.data; 
};
