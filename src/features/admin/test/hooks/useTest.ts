import * as api from "@/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Test } from "@/types/Test";

type TestFormValues = {
  title: string;
  description: string;
  duration: number;
  summury: string;
  category: string;
  passingScore: number;
  prompt: string;
};

export const useCreateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTest"],
    mutationFn: (data: TestFormValues) => api.createTest(data),
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
  });
};

export const useGetAllTests = () => {
  return useQuery({
    queryKey: ["tests"],
    queryFn: () => api.getTest(),
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};

export const useGetTest = (id: string) => {
  return useQuery<Test>({
    queryKey: ["test", id],
    queryFn: () => api.getTestDetails(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};

export const useEnRollTest = (id: string) => {
  return useMutation({
    mutationKey: ["enRollTest",id],
    mutationFn: (data) => api.enRolltest(data),
    retry: 0,
  });
}