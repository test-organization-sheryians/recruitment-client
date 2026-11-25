import { useState } from "react";

interface ReviewFormProps {
  userId?: string;
  productId?: string;
  initialRating?: number; // ✨ new
  initialComment?: string; // ✨ new
  onSubmit: (data: { rating: number; comment?: string }) => void;
}

const ReviewForm = ({
  initialRating = 5,
  initialComment = "",
  onSubmit,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, comment });
    setComment(""); // reset after submit
    setRating(5);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border p-2 w-full mb-2"
      >
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>
            {r} Star
          </option>
        ))}
      </select>

      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default ReviewForm;
