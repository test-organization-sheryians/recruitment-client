import api from "@/features/admin/config/axios";
import { Review, CreateReviewPayload } from "@/types/review";

export const createReview = async (data: CreateReviewPayload) => {
   console.log("POST payload to /api/reviews:", data);
  try {
    const response = await api.post("/api/reviews", data);
    return response.data;
  } catch (error: any) {
    console.error("CREATE REVIEW ERROR:", error.response?.data || error.message);
    throw error;
  }
};
