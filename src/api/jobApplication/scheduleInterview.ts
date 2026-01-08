import api from "@/config/axios";

export type ScheduleInterviewPayload = {
  candidateId: string;
  jobId: string;
  interviewerEmail: string;
  meetingLink: string;
  timing: string;
  status?: "Scheduled"; // Added status to type based on your usage
};

export const scheduleInterview = async (payload: ScheduleInterviewPayload) => {
  const response = await api.post(`/api/interviews/`, payload);
  return response.data;
};

// ✅ ADD THIS FUNCTION
export const getInterviewsByJobId = async (jobId: string) => {
  const response = await api.get(`/api/interviews/job/${jobId}`);
  return response.data;
};