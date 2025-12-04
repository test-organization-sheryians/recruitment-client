import api from "@/config/axios";

export const updateProfile = async (data: any) => {

  // Remove null or undefined fields
  const cleanData: any = {};
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      cleanData[key] = data[key];
    }
  });

  const response = await api.patch(
    "/api/candidate-profile/update-profile",
    cleanData
  );

  return response.data;
};

