import api from '@/config/axios';
import { Company } from '@/types/company';

export type UpdateCompanyInput = Partial<Omit<Company, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>>;

export const updateCompany = async ({ id, data }: { id: string; data: UpdateCompanyInput }): Promise<Company> => {
  const response = await api.put(`/api/company/updateCompany/${id}`, data);
  return response.data?.updatedData;
};
