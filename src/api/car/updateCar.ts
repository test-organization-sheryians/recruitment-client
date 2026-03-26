import api from "@/config/axios";
import { Car, UpdateCarPayload } from "@/types/car";

type UpdateCarVariables = UpdateCarPayload & {
  carId: string;
};

export const updateCar = async (
  data: UpdateCarVariables
): Promise<Car> => {
  const { carId, ...payload } = data;

  const response = await api.put(`/api/car/update/${carId}`, payload);

  return response.data;
};

