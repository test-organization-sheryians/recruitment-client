import api from "@/features/admin/config/axios";
import { Review } from "@/types/review";

export const getReviews = async (
  productId: string
): Promise<Review[]> => {
  try {
    const response = await api.get(
      `/api/reviews/product/${productId}`
    );

    return response.data ?? [];
  } catch (error: any) {
    console.error("GET REVIEWS ERROR:", error?.response?.data || error.message);

    // Important: return empty array instead of throwing
    return [];
  }
};
