import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "@/api";

// ===============================
// Queries
// ===============================

// Admin - Get all reports
export const useGetAllReports = () => {
  return useQuery({
    queryKey: ["jobReports"],
    queryFn: () => api.getAllReports(),
    retry: 0,
  });
};

// User - Get own reports
export const useGetMyReports = () => {
  return useQuery({
    queryKey: ["myJobReports"],
    queryFn: () => api.getMyReports(),
    retry: 0,
  });
};

// ===============================
// Invalidation Helper
// ===============================

const invalidateJobReports = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["jobReports"] });
  queryClient.invalidateQueries({ queryKey: ["myJobReports"] });
};

// ===============================
// Mutations
// ===============================

// User - Report a job
export const useReportJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["reportJob"],
    mutationFn: (data: {
      jobId: string;
      reason: "spam" | "fake" | "wrong_info" | "other";
      description?: string;
    }) => api.reportJob(data),
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myJobReports"] });
    },
  });
};

// Admin - Update report status
export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateReportStatus"],
    mutationFn: (data: {
      id: string;
      status: "pending" | "reviewed" | "resolved";
    }) => api.updateReportStatus(data.id, data.status),
    retry: 0,
    onSuccess: () => invalidateJobReports(queryClient),
  });
};

// Admin - Delete report
export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteReport"],
    mutationFn: (id: string) => api.deleteReport(id),
    retry: 0,
    onSuccess: () => invalidateJobReports(queryClient),
  });
};
