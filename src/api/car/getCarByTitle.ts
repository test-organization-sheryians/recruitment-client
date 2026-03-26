import api from "@/config/axios";

export const getCarByTitle = async(title: string) => {
  const response = await api.get(`/api/car/title/${title}`);
  return response.data;
};
