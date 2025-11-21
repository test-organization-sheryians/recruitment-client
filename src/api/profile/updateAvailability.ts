import api from "@/config/axios";

export const updateAvailability = async (availability: string) => {
  const response = await api.patch("/api/candidate/update-availability", {
    availability,
  });
  return response.data;
};
