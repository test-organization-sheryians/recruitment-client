import api from "@/config/axios";

export const deleteReport = async (id: string) => {
  await api.delete(`/api/job-reports/${id}`);
};
