import * as api from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: () => api.getAllSkills(),
  });
};


// export const useGetSkill = (id?: string) => {
//   return useQuery({
//     queryKey: ["skill", id],
//     queryFn: () => api.getSkill(id),
//     enabled: id,
//   });
// };

export const useGetSkill = (id: string | undefined) => {
  return useQuery({
    queryKey: ["skill", id],
    // queryFn is now an arrow function that checks for ID before calling api
    queryFn: () => api.getSkill(id as string), 
    enabled: !!id, // Runs only when id is a non-empty string
  });
};


export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createSkill"],
    mutationFn: (data: { name: string }) => api.createSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
};


export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateSkill"],
    mutationFn: (data: { id: string; name: string }) => api.updateSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
};

// export const useDeleteSkill = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationKey: ["deleteSkill"],
//     mutationFn: (id: string) => {
//       console.log("Mutation Received ID:", id);
//       return api.deleteSkill(id);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["skills"]);
//     },
//   });
// };


// export const useDeleteSkill = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//       mutationKey: ["deleteSkill"],
// mutationFn: (id: string | {id: string}) => {  api.deleteSkill(id),
//      console.log(id)  },

//     onSuccess: () => {
//       queryClient.invalidateQueries(["skills"]);
//     },
//   });
// };

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteSkill"],
    // Fix: Simplify the type signature to expect a single string 'id'
    mutationFn: (id: string) => { 
      console.log(id);
      return api.deleteSkill(id); 
    },
    // The previous incorrect line was: mutationFn: (id: string | { id: string }) => api.deleteSkill(id),

    onSuccess: () => {
      // Corrected the query key for invalidation based on TanStack Query conventions
      queryClient.invalidateQueries({ queryKey: ["skills"] }); 
    },
  });
};



// export const useDeleteSkill = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationKey: ["deleteSkill"],
//     mutationFn: (id: string) => {  api.deleteSkill(id),
//       console.log("ID sending to API:", id)
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["skills"] });
//     },
//   });
// };
