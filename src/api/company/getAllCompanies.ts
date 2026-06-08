import api from '@/config/axios';
import { Company } from '@/types/company';

export const getAllCompanies = async (): Promise<Company[]> => {
  const response = await api.get("/api/company/getAllCompanies");
  return response.data?.data || [];
};
