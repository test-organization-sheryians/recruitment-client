import * as api from "@/api";
import {  useQuery } from "@tanstack/react-query";

export const useJobApplicant = () => {
    return useQuery({
        queryKey: ["jobApplicant"],
        queryFn: () => api.getAllApplicant(),
        retry: 0,
    });
};