import { apiClient, type FreelancerProfile } from "@/lib/api";

export interface CreateProfilePayload {
  hourlyRate: number;
  availability: string;
  projects?: Array<{ title: string; githubUrl?: string }>;
}

export interface SharePortfolioPayload {
  freelancers: string[];
}

export const freelancerApi = {
  createProfile: async (
    data: CreateProfilePayload,
  ): Promise<FreelancerProfile> => {
    return apiClient.createFreelancerProfile(data);
  },

  createSharePortfolio: async (
    data: SharePortfolioPayload,
  ): Promise<{ shareLink: string }> => {
    return apiClient.createSharePortfolio(data.freelancers);
  },

  getSharedPortfolio: async (
    shareId: string,
  ): Promise<{ count: number; data: FreelancerProfile[] }> => {
    return apiClient.getSharedPortfolio(shareId);
  },
};
