import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api/review";
import {
  Review,
  CreateReviewPayload,
  UpdateReviewPayload,
  DeleteReviewPayload,
} from "@/types/review";

// GET ALL
export const useGetReviews = (productId?: string) =>
  useQuery<Review[]>({
    queryKey: ["reviews", productId],
    queryFn: () => api.getReviews(productId as string),
    enabled: !!productId,
  });

// GET SINGLE
export const useGetSingleReview = (id?: string) =>
  useQuery<Review>({
    queryKey: ["review", id],
    queryFn: () => api.getSingleReview(id as string),
    enabled: !!id,
  });

// CREATE
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewPayload) =>
      api.createReview(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", data.productId],
      });
    },
  });
};

// UPDATE
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateReviewPayload) =>
      api.updateReview(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["review", variables.id],
      });
    },
  });
};

// DELETE
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteReviewPayload) =>
      api.deleteReview(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.productId],
      });
    },
  });
};
 