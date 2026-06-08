import api from '@/config/axios';
import { Company } from '@/types/company';

export type CreateCompanyInput = Omit<Company, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>;

export const createCompany = async (data: CreateCompanyInput): Promise<Company> => {
  const response = await api.post("/api/company/create", data);
  return response.data?.data;
};
