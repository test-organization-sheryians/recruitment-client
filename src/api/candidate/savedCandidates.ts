import axiosInstance from "@/config/axios";

/**
 * Save a candidate for later viewing
 * POST /api/saved-candidates/:candidateId
 */
export const saveCandidate = async (candidateId: string) => {
  const response = await axiosInstance.post(
    `/api/saved-candidates/${candidateId}`
  );
  return response.data;
};

/**
 * Get all saved candidates
 * GET /api/saved-candidates
 */
export const getSavedCandidates = async () => {
  const response = await axiosInstance.get("/api/saved-candidates");
  return response.data;
};

/**
 * Check if a candidate is saved
 * GET /api/saved-candidates/:candidateId/status
 */
export const getSavedCandidateStatus = async (candidateId: string) => {
  const statusUrl = `/api/saved-candidates/${candidateId}/status`;
  const response = await axiosInstance.get(statusUrl);
  return response.data;
};

/**
 * Remove a saved candidate
 * DELETE /api/saved-candidates/:candidateId
 */
export const removeSavedCandidate = async (candidateId: string) => {
  const response = await axiosInstance.delete(
    `/api/saved-candidates/${candidateId}`
  );
  return response.data;
};
