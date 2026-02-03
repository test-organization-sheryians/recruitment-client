import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCourses } from "@/api/Pcourse/getAll";
import { deleteCourse } from "@/api/Pcourse/delete";
import { createCourse } from "@/api/Pcourse/create";

import { toast } from "react-toastify";

// HOOK 1: Fetching Data (The Reader)
export const useCourses = () => {
    return useQuery({
        queryKey: ["courses"],
        queryFn: getAllCourses,
    });
};

// HOOK 2: Modifying Data 
export const useCourseMutations = () => {
    const queryClient = useQueryClient();

    // 1. Logic to Create
    const createMutation = useMutation({
        mutationFn: createCourse,
        onSuccess: () => {
            // Refresh the list immediately
            queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course Created Successfully!");        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to create course");
        }
    });

    // 2. Logic to Delete
    const deleteMutation = useMutation({
        mutationFn: deleteCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            toast.success("Course Deleted Successfully!");
        },
    });

    return { createMutation, deleteMutation };
};