import api from "@/features/admin/config/axios";
import { Review, UpdateReviewPayload } from "@/types/review";

export const updateReview = async (
  data: UpdateReviewPayload
): Promise<Review> => {
  const { id, ...payload } = data;
  const response = await api.patch(`/api/reviews/update/${id}`, payload);
  return response.data;
};
