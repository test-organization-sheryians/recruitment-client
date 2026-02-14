import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "@/api";


export const useGetAllClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: () => api.getClients(),
    retry: 0,
  });
};


export const useGetClient = (id?: string) => {
  return useQuery({
    queryKey: ["client", id],
    queryFn: () => api.getClientById(id!),
    enabled: !!id,
    retry: 0,
  });
};


export const useDeleteClient = () => {
  return useMutation({
    mutationKey: ["deleteClient"],
    mutationFn: (id?: string) => api.deleteClient(id!),
    retry: 0,
  });
};

// export const useDeleteJob = () => {
//   return useMutation({
//     mutationKey: ["deleteJob"],
//     mutationFn: (id: string) => api.deleteJob(id),
//     retry: 0,
//   });
// };

export const useRegisterClient = () => {
  return useMutation({
    mutationKey: ["registerClient"],
    mutationFn: (data) => api.registerClient(data),
    retry: 0,
  });
};

export const useUpdateClient = () => {
  return useMutation({
    mutationKey: ["updateClient"],
    mutationFn: ({id,data,}: {id: string;
      data: any;
    }) => api.updateClinet(id, data),
  });
};