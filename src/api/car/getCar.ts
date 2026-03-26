import api from "@/config/axios";

export const getCar = async (carId: string) => {
  const response = await api.get(`/api/car/get/${carId}`);
  return response.data;
};
