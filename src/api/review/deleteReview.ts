import api from "@/features/admin/config/axios";
import { DeleteReviewPayload } from "@/types/review";

export const deleteReview = async (
  data: DeleteReviewPayload
): Promise<void> => {
  try {
    const response = await api.delete(`/api/reviews/delete/${data.id}`, {
      params: { productId: data.productId },
    });
    return response.data;
  } catch (error: any) {
    console.error("DELETE REVIEW ERROR:", error.response?.data || error.message);
    throw error;
  }
};
