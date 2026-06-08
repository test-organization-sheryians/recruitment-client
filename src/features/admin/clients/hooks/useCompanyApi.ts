import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "@/api";
import { CreateCompanyInput } from "@/api/company/createCompany";
import { UpdateCompanyInput } from "@/api/company/updateCompany";

export const useGetAllCompanies = () => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => api.getAllCompanies(),
    retry: 1,
  });
};

export const useGetSingleCompany = (id?: string) => {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => api.getSingleCompany(id!),
    enabled: !!id,
    retry: 1,
  });
};

const invalidateCompanies = (queryClient: QueryClient, id?: string) => {
  queryClient.invalidateQueries({ queryKey: ["companies"] });
  if (id) {
    queryClient.invalidateQueries({ queryKey: ["company", id] });
  }
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createCompany"],
    mutationFn: (data: CreateCompanyInput) => api.createCompany(data),
    retry: 0,
    onSuccess: () => invalidateCompanies(queryClient),
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateCompany"],
    mutationFn: ({ id, data }: { id: string; data: UpdateCompanyInput }) =>
      api.updateCompany({ id, data }),
    retry: 0,
    onSuccess: (_, variables) => invalidateCompanies(queryClient, variables.id),
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteCompany"],
    mutationFn: (id: string) => api.deleteCompany(id),
    retry: 0,
    onSuccess: () => invalidateCompanies(queryClient),
  });
};
