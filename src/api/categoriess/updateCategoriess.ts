import api from "@/config/axios";

export interface UpdateCategoryPayload {
  id: string;
  name: string;
}

export const updateCategoriess = async (
  payload: UpdateCategoryPayload
) => {
  const { id, name } = payload;

  const response = await api.put(`/api/categories/${id}`, {
    name,
  });

  return response.data;
};
