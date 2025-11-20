import api from "@/config/axios";

export const getJobRolesByClient = async (clientId: string | number) => {
  const res = await api.get(`/api/jobs/client/${clientId}`);
  return res.data;
};
