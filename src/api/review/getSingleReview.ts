import api from "@/features/admin/config/axios";
import { Review } from "@/types/review";

export const getSingleReview = async (id: string): Promise<Review> => {
  try {
    const response = await api.get(`/api/reviews/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("GET SINGLE REVIEW ERROR:", error?.response?.data || error.message);
    throw error;
  }
};
