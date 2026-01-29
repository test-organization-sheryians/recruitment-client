import { useMutation, useQuery } from '@tanstack/react-query'
import * as api from '@/api';

export const useGetJobCategories = () => {
    return useQuery({
        queryKey: ['jobCategoriesbyh'],
        queryFn: () => api.getCategoriesbyh(),
        retry: 1,
    });
};

export const useAddJobCategory = () => {
    return useMutation({
        mutationKey: ["addJobCategoriesbyh"],
        mutationFn: (data: { name: string }) => api.addCategorybyh(data),
        retry: 0,
    })
}

export const useUpdateJobCategory = () => {
    return useMutation({
        mutationKey: ["updateJobCategoriesbyh"],
        mutationFn: ({ id, name }: { id: string; name: string }) => api.updateCategorybyh({ id, name }),
        retry: 0,
    })
}

export const useDeleteJobCategory = () => {
    return useMutation({
        mutationKey: ["deleteJobCategoriesbyh"],
        mutationFn: (id: string) => api.deleteCategorybyh(id),
        retry: 0
    })
}