import { Review } from "@/types/review";

interface ReviewListProps {
  reviews?: Review[];
  onDelete: (id: string) => void;
  onEdit: (review: Review) => void;
}

const ReviewList = ({ reviews = [], onDelete, onEdit }: ReviewListProps) => {
  if (reviews.length === 0) return <p className="text-gray-500 mt-2">No reviews yet.</p>;

  return (
    <div className="mt-4 space-y-3">
      {reviews.map((review) => (
        <div key={review._id} className="p-3 bg-white rounded shadow flex justify-between items-center">
          <div>
            <p className="font-medium">Rating: {review.rating} ⭐</p>
            <p className="text-gray-700">{review.comment}</p>
            <div className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(review)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
            <button onClick={() => onDelete(review._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
