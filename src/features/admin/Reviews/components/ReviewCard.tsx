import { Review } from "@/types/review";
import RatingStars from "./RatingStars";

interface ReviewCardProps {
  review: Review;
  onDelete?: (id: string) => void;
  onEdit?: (review: Review) => void;
}

const ReviewCard = ({ review, onDelete, onEdit }: ReviewCardProps) => {
  return (
    <div className="border p-4 rounded mb-3 shadow hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <RatingStars rating={review.rating} />
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(review)}
              className="text-blue-500 hover:underline"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(review._id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {review.comment && <p className="mt-2 text-gray-700">{review.comment}</p>}

      <div className="flex justify-between mt-2 text-sm text-gray-500">
        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
        <span>{review.isActive ? "Active" : "Inactive"}</span>
      </div>
    </div>
  );
};

export default ReviewCard;
