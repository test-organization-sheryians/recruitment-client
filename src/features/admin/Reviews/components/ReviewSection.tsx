"use client";

import { useState } from "react";
import { Review } from "@/types/review";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import ReviewEditModal from "./ReviewEditModal";

interface ReviewSectionProps {
  reviews: Review[];
  onCreate: (data: { rating: number; comment?: string }) => void;
  onDelete: (id: string) => void;
  onUpdate: (data: { id: string; rating: number; comment?: string }) => void;
}

const ReviewSection = ({ reviews, onCreate, onDelete, onUpdate }: ReviewSectionProps) => {
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-3">Reviews</h2>

      {/* Create Review Form */}
      <ReviewForm onSubmit={onCreate} />

      {/* Review List */}
      <ReviewList
        reviews={reviews}
        onDelete={onDelete}
        onEdit={(review) => setEditingReview(review)}
      />

      {/* Edit Modal */}
      {editingReview && (
        <ReviewEditModal
          review={editingReview}        // ✅ single review
          onClose={() => setEditingReview(null)}
          onUpdate={onUpdate}           // ✅ make sure parent passed it
        />
      )}
    </div>
  );
};

export default ReviewSection;
