import api from "@/config/axios";

interface GetSingleExperienceParams {
  id: string;
}

export const getSingleExperience = async ({ id }: GetSingleExperienceParams) => {
  const response = await api.get(`/api/experience/${id}`);
  return response.data;
};
