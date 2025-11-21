import api from "@/config/axios";

// Patch profile supports either JSON object or FormData
export const patchProfile = async (
  userId: string,
  data: Record<string, unknown> | FormData
) => {
  return api.patch(`/api/candidate-profile/update-profile`, data, {
    headers: data instanceof FormData
      ? { "Content-Type": "multipart/form-data" }
      : undefined,
  }).then(res => res.data);
};
