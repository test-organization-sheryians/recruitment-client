import api from "@/config/axios";
import { CreateInterviewPayload, InterviewStatus, RescheduleInterviewPayload } from "@/types/applicant";

export const createInterview = async (data: CreateInterviewPayload) => {
  const res = await api.post("/api/interviews", data);
  return res.data;
};

export const getMyScheduleInterviews = async () => {
  const res = await api.get("/api/interviews/me");
  return res.data;
};

export const getAllInterviews = async () => {
  const res = await api.get("/api/interviews/all");
  return res.data;
};

export const getInterviewById = async (id: string) => {
  const res = await api.get(`/api/interviews/${id}`);
  return res.data;
};

export const getInterviewByJobId = async (jobId: string) => {
  const res = await api.get(`/api/interviews/job/${jobId}`);
  return res.data;
};

export const updateInterviewStatus = async (
  id: string,
  status: InterviewStatus
) => {
  const res = await api.patch(`/api/interviews/${id}/status`, { status });
  return res.data;
};

export const rescheduleInterview = async (
  interviewId: string,
  data: RescheduleInterviewPayload
) => {
  const res = await api.patch(
    `/api/interviews/${interviewId}/reschedule`,
    data
  );
  return res.data;
};

export const deleteInterview = async (id: string) => {
  const res = await api.delete(`/api/interviews/${id}`);
  return res.data;
};
