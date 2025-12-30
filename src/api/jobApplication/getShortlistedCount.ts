import api from "@/config/axios";

export type ShortlistedCounts = {
  shortlistedApplications: number;
  shortlistedCandidates: number;
};

export const getShortlistedCount = async (): Promise<ShortlistedCounts> => {
  const res = await api.get(`/api/job-apply/shortlisted/count`);
  // expected response shape: { success: true, data: { shortlistedApplications, shortlistedCandidates } }
  return res.data.data;
};
