"use client";

import { useState } from "react";
import { Review } from "@/types/review";
import ReviewForm from "./ReviewForm";

interface ReviewEditModalProps {
  review: Review;
  onClose: () => void;
  onUpdate: (data: { id: string; rating: number; comment?: string }) => void;
}

const ReviewEditModal = ({ review, onClose, onUpdate }: ReviewEditModalProps) => {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment || "");

  const handleSubmit = (data: { rating: number; comment?: string }) => {
    onUpdate({ id: review._id, rating: data.rating, comment: data.comment });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Edit Review</h2>

        <ReviewForm
          initialRating={rating}
          initialComment={comment}
          onSubmit={handleSubmit}
        />

        <button
          onClick={onClose}
          className="mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReviewEditModal;
