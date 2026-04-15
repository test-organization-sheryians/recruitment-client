import api from "@/config/axios";
export interface UpdateProfilePayload {
  id:string , 
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  resumeFile?: string;
  resumeFileNoPI?: string;
  skills?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  key?: string;
  leetcodeUrl?: string;
}

export const updateProfile = async (data: UpdateProfilePayload) => {
  const cleanData: Partial<UpdateProfilePayload> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined) {
      cleanData[key as keyof UpdateProfilePayload] = value;
    }
  }

  const response = await api.patch(
    "/api/candidate-profile/update-profile",
    cleanData
  );

  return response.data.data;
};

