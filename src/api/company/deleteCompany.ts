import api from '@/config/axios';
import { Company } from '@/types/company';

export const deleteCompany = async (id: string): Promise<Company> => {
  const response = await api.delete(`/api/company/deleteCompany/${id}`);
  return response.data?.deletedCompany;
};
