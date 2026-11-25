"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import { Review } from "@/types/review";
import ReviewSection from "@/features/admin/Reviews/components/ReviewSection";

import {
  useGetReviews,
  useCreateReview,
  useDeleteReview,
  useUpdateReview,
} from "@/features/admin/Reviews/hooks/useReviewApi";
import { useToast } from "@/components/ui/Toast";

export default function ReviewPage() {
  const { success, error } = useToast();

  //  Hardcoded productId
  const productId = "69871fa7c814e470cd4a49be";

  const authUser = useSelector((state: RootState) => state.auth.user);
  const userId = authUser?.id;


  /* =========================
     GET REVIEWS
  ========================== */
  const { data, isLoading: isFetching, isError } = useGetReviews(productId);
  const reviews: Review[] = Array.isArray(data) ? data : [];

  /* =========================
     CREATE REVIEW
  ========================== */
  const { mutate: createReview, isPending: isCreating, error: createError } =
    useCreateReview();

  /* =========================
     DELETE REVIEW
  ========================== */
  const { mutate: deleteReview, isPending: isDeleting, error: deleteError } =
    useDeleteReview();

  /* =========================
     UPDATE REVIEW
  ========================== */
  const { mutate: updateReview, error: updateError } = useUpdateReview();

  useEffect(() => {
    if (createError) error("Failed to create review");
    if (deleteError) error("Failed to delete review");
    if (updateError) error("Failed to update review");
  }, [createError, deleteError, updateError, error]);

  /* =========================
     HANDLERS
  ========================== */
  const handleCreate = (data: { rating: number; comment?: string }) => {
    if (!userId) return error("You must be signed in to add a review");

    createReview(
      {
        rating: data.rating,
        comment: data.comment,
        productId,
        userId,
      },
      {
        onSuccess: () => success("Review added successfully"),
      }
    );
  };

  const handleDelete = (id: string) => {
    if (!userId) return error("You must be signed in to delete a review");

    deleteReview(
      { id, productId },
      {
        onSuccess: () => success("Review deleted successfully"),
      }
    );
  };

  const handleUpdateReview = (data: { id: string; rating: number; comment?: string }) => {
    updateReview(
      { ...data, productId },
      { onSuccess: () => success("Review updated successfully") }
    );
  };

  const isAnyLoading = isCreating || isDeleting || isFetching;

  /* =========================
     UI
  ========================== */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Manage Reviews
          <span className="ml-3 px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-600 rounded-full">
            {isFetching ? "..." : reviews.length}
          </span>
        </h1>

        {isError ? (
          <div className="text-center py-6">
            <p className="text-red-600 mb-3">Failed to load reviews.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        ) : (
          <ReviewSection
            reviews={reviews}
            onCreate={handleCreate}
            onDelete={handleDelete}
            onUpdate={handleUpdateReview}
          />
        )}
      </div>

      {isAnyLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3">
            <div className="w-7 h-7 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium">Please wait...</span>
          </div>
        </div>
      )}
    </div>
  );
}