import api from "@/config/axios";


export type BulkUpdatePayload = {
  applicationIds: string[];
  status: string;
};


export const bulkUpadteData = async (payload:BulkUpdatePayload) => {
 //changing the user aplication status in bulk
  const response = await api.patch(`api/job-apply/bulk-update`, payload);
    return response.data;

}