import api from "@/config/axios";

export const updateAvailability = async (availability: string) => {
  const response = await api.patch("/api/candidate-profile/update-availability", {
    availability,
  });
  return response.data;
};
