import * as api from "@/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Test, TestFormValues } from "@/types/Test"; 
import { searchUserTest } from "@/api";
import toast from "react-hot-toast";


export const useCreateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTest"],
    mutationFn: (data: TestFormValues) => api.createTest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
  });
};

export const useGetAllTests = () => {
  return useQuery({
    queryKey: ["tests"],
    queryFn: api.getTest,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetTest = (id: string) => {
  return useQuery<Test>({
    queryKey: ["test", id],
    queryFn: () => api.getTestDetails(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

type UpdatePayload = {
  id: string;
  data: TestFormValues;
};

export const useUpdateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateTest"],
    mutationFn: ({ id, data }: UpdatePayload) =>
      api.updateTest({ id, ...data }), // Merge id into data object

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
  });
};

export const useEnRollTest = () => {
  return useMutation({
    mutationKey: ["enRollTest"],
    mutationFn: (data: { testId: string }) =>
      api.enRolltest(data),
    retry: 0,
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
  return useQuery<string[]>({
    queryKey: ["search-users", query],
    queryFn: async () => {
      const res = await searchUserTest(query);
      return res?.data?.map((u: { email: string }) => u.email) ?? [];
    },
    enabled: query.trim().length > 1,
    staleTime: 5000,
    placeholderData: [],
  });
};


export const useGetUserAttempts = (id: string) => {
  return useQuery({
    queryKey: ["getUserAttempts", id],
    queryFn: () => api.getUserAttempts(id),
    retry: 0,
  });
};

export const usePublishTestResult = ()=>{
  const queryClient=useQueryClient();
  return useMutation({
    mutationKey:["PublishTest"],
    mutationFn:api.publishResult,
    onSuccess:(testId)=>{
            toast.success("Results published successfully");
        queryClient.invalidateQueries({
        queryKey: ["tests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["testAttempts", testId],
      });

    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to publish results"
      );
    },
  })
}