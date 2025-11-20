import { useMutation, useQuery } from '@tanstack/react-query';
import * as api from "@/api";


export const useGetJobCategories = () => {
    return useQuery({
        queryKey: ["jobCategories"],
        queryFn: () => api.getCategories(),
        retry: 1,
    });
};

export const useAddJobCategory = () => {
    return useMutation({
        mutationKey: ["addJobCategory"],
        mutationFn: (data: { name: string }) => api.addCategory(data),
        retry: 0,
    });
};

export const useDeleteJobCategory = () => {
    return useMutation({
        mutationKey: ["deleteJobCategory"],
        mutationFn: (id: string) => api.deleteCategory(id),
        retry: 0,
    });
};

export const useUpdateJobCategory = () => {
    return useMutation({
        mutationKey: ["updateJobCategory"],
        mutationFn: ({ id, name }: { id: string; name: string }) => api.updateCategory({ id, name }),
        retry: 0,
    });
};