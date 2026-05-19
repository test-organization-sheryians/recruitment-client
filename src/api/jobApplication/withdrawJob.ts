import api from "@/config/axios"

export type WithdrawJobVariables = {
  jobId: string;
};

export type WithdrawJobResponse = {
  message: string;
};

export const withdrawJob = async (
  payload: WithdrawJobVariables
): Promise<WithdrawJobResponse> => {
  const res = await api.post("/api/job-apply/withdraw", payload);
  return res.data;
};
