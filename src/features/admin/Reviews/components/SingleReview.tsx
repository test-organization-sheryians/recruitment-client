// "use client";

// import { useState } from "react";
// import { useGetSingleReview } from "@/features/admin/Reviews/hooks/useReviewApi";
// import { Review } from "@/types/review";
// import RatingStars from "./RatingStars";

// interface SingleReviewProps {
//   reviewId: string;
// }

// const SingleReview = ({ reviewId }: SingleReviewProps) => {
//   const { data: review, isLoading, isError } = useGetSingleReview(reviewId);

//   if (isLoading) return <p>Loading review...</p>;
//   if (isError || !review) return <p className="text-red-600">Failed to load review.</p>;

//   return (
//     <div className="border p-4 rounded shadow bg-white max-w-md mx-auto mt-4">
//       <h3 className="text-lg font-bold mb-2">Review by User {review.userId}</h3>
//       <RatingStars rating={review.rating} />
//       {review.comment && <p className="mt-2 text-gray-700">{review.comment}</p>}
//       <div className="text-sm text-gray-500 mt-1">
//         Created on: {new Date(review.createdAt).toLocaleDateString()}
//       </div>
//       <div className="text-sm text-gray-500">
//         Status: {review.isActive ? "Active" : "Inactive"}
//       </div>
//     </div>
//   );
// };

// export default SingleReview;
