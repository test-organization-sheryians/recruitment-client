import * as api from "@/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Test, TestFormValues } from "@/types/Test"; 
import { searchUserTest } from "@/api";
import { EnrollUsersResponse } from "@/types/Enrollment";
import { AxiosError } from "axios";
import toast from "react-hot-toast";


type EnrollPayload = {
  testId: string;
  emails: string[];
};







// export const useDeleteTest = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: string) => api.deleteTest(id),

//     onSuccess: async () => {
//       await queryClient.invalidateQueries({ queryKey: ["tests"] });
//     },

//     onError: (error: any) => {
//       // 👇 agar backend se success aa chuka hai, error ignore karo
//       if (error?.response?.status === 404) {
//         return;
//       }

//       console.error("Delete test failed", error);
//     },
//   });
// };
export const useDeleteTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteTest(id),

    // 🚀 INSTANT UI UPDATE
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tests"] });

      const previousTests = queryClient.getQueryData<any[]>(["tests"]);

      queryClient.setQueryData<any[]>(["tests"], (old) =>
        old ? old.filter((t) => t._id !== id) : []
      );

      return { previousTests };
    },

    // ❌ rollback only if real error
    onError: (_err, _id, context) => {
      if (context?.previousTests) {
        queryClient.setQueryData(["tests"], context.previousTests);
      }
    },

    // 🔄 background refetch
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
  });
};





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
  return useMutation<
    EnrollUsersResponse,                 // ✅ success response
    AxiosError<{ message?: string }>,    // ✅ error type
    EnrollPayload                        // ✅ payload
  >({
    mutationKey: ["enrollTestuser"],
    mutationFn: (data) => api.enrollTestuser(data),
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
    onError: () => {
      toast.error(
        "Failed to publish results"
      );
    },
  })
}













