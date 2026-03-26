 import api from "@/config/axios";


export const deleteCar = async (carId: string) => {
  const response = await api.delete(`/api/car/delete/${carId}`);
  return response.data;
};

