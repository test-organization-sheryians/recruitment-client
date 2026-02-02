import api from "@/config/axios";

export const deleteTask = async (id: string) => {
  const response = await api.delete(`/api/tasks/delete/${id}`);
  return response.data;
};
