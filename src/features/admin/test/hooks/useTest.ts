import * as api from "@/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Test } from "@/types/Test";


type TestFormValues = {
  title: string;
  description: string;
  duration: number;
  summary: string;
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

export const useEnrollTest = (id: string) => {
  return useMutation({
    mutationKey: ["enrollTest", id],
    mutationFn: async (data: { testId: string; emails: string[] }) => api.enRolltest(data),
    retry: 0,
  });
}


export const useUpdateTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateTest"],
    mutationFn: (data: TestFormValues) => api.updateTest(data), 
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    }
  });

};
export const useSearchUser = (searchTerm: string) => {
  return useQuery({
    queryKey: ["search-user", searchTerm],
    queryFn: () => api.searchUser(searchTerm),
    enabled: !!searchTerm,   // only run query if searchTerm exists
    staleTime: 5000,         // 5s caching
  });
};
