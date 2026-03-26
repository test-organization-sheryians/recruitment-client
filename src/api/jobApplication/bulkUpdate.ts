import api from "@/config/axios";

export type BulkUpdatePayload = {
  applicationIds: string[];
  status: string;
};

export const bulkUpdateData = async (payload: BulkUpdatePayload) => {
  const response = await api.patch(`/api/job-apply/bulk-update`, payload);
  return response.data;
};
