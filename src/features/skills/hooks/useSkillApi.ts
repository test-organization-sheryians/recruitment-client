import * as api from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const usegetAllSkills = () => {
    return useQuery({
        queryKey: ['getAllSkills'],
        queryFn: () => api.getAllSkills(undefined)
    })
}

export const useCreateSkill = () => {
    return useMutation({
        mutationKey: ['createSkill'],
        mutationFn: (data) => api.createSkill(data)
    })
}

export const useGetSkill = () => {
    return useMutation({
        mutationKey: ['getSkill'],
        mutationFn: (data) => api.getSkill(data)
    })
}
export const useUpdateSkill = () => {
    return useMutation({
        mutationKey: ['updateSkill'],
        mutationFn: (data) => api.updateSkill(data)
    })
}
export const useDeleteSkill = () => {
    return useMutation({
        mutationKey: ['deleteSkill'],
        mutationFn: (data) => api.deleteSkill(data)
    })
}
