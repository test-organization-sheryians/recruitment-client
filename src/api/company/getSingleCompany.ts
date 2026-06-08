import api from '@/config/axios';
import { Company } from '@/types/company';

export const getSingleCompany = async (id: string): Promise<Company> => {
  const response = await api.get(`/api/company/getSingleCompany/${id}`);
  return response.data?.company;
};
