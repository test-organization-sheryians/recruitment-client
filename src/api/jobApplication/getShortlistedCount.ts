import api from "@/config/axios";

export const getShortlistedCount = async () => {
  const res = await api.get(`/api/job-apply/shortlisted/count`);
  return res.data.data; // { shortlistedApplications, shortlistedCandidates }
};

export default getShortlistedCount;
