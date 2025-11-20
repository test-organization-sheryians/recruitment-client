import * as api from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: () => api.getAllSkills(),
  });
};


export const useGetSkill = (id?: string) => {
  return useQuery({
    queryKey: ["skill", id],
    queryFn: () => api.getSkill(id),
    enabled: !!id,
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

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteSkill"],
    mutationFn: (id: string) => {
      console.log("MUTATION RECEIVED ID:", id);
      return api.deleteSkill(id);
    },
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




// export const useDeleteSkill = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationKey: ["deleteSkill"],
//     mutationFn: ({id}) => api.deleteSkill(id),

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["skills"] });
//     },
//   });
// };



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
