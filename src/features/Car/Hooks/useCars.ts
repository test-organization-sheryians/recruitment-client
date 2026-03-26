import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";
import { UpdateCarPayload } from "@/types/car";


// ✅ CREATE
export const useCreateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createCar"],
    mutationFn: (data: FormData) => api.createCar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCars"] });
    },
    retry: 0,
  });
};


// ✅ DELETE
export const useDeleteCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteCar"],
    mutationFn: (carId: string) => api.deleteCar(carId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCars"] });
    },
    retry: 0,
  });
};


// ✅ UPDATE
type UpdateCarVariables = UpdateCarPayload & {
  carId: string;
};

export const useUpdateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateCar"],
    mutationFn: (data: UpdateCarVariables) => api.updateCar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCars"] });
    },
    retry: 0,
  });
};


// ✅ GET ALL CARS 
export const useGetAllCar = () => {
  return useQuery({
    queryKey: ["allCars"],
    queryFn: ()=> api.getAllCars(),
  });
};


// ✅ GET SINGLE CAR (FIXED)
export const useGetCar = (carId?: string) => {
  return useQuery({
    queryKey: ["car", carId],
    queryFn: () => api.getCar(carId!),
    enabled: !!carId, // prevents unnecessary calls
  });
};