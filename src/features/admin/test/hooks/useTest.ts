import * as api from "@/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Test } from "@/types/Test";
import { searchUserTest } from "@/api";

type TestFormValues = {
  title: string;
  description: string;
  duration: number;
  summury: string;
  showResults : boolean
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

export const useUpdateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateTest"],

    // FIXED: id MUST be included
    mutationFn: (data: Partial<TestFormValues> & { id: string }) =>
      api.updateTest(data),

    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
  });
};

export const useEnrollTestuser = () => {
  return useMutation({
    mutationKey: ["enrollTestuser"],
    mutationFn: (data: { testId: string; emails: string[] }) =>
      api.enrollTestuser(data),
    retry: 0,
  });
};


export const useSearchUserTest = (query: string) => {
  return useQuery({
    queryKey: ["search-users", query],
    queryFn: async () => {
      const res = await searchUserTest(query);

      // ⚠️ data is users list → we return only emails
      if (res?.data) {
        return res.data.map((user: { email: string }) => user.email);
      }

      return [];
    },
    enabled: query.trim().length > 1,
    staleTime: 5000,
    placeholderData: [],
  });
};


export const useGetUserAttempts = (id : string) => {
  return useQuery({
        queryKey: ["getUserAttempts" , id],
        queryFn: () => api.getUserAttempts(id),
        retry: 0,
  })
}

