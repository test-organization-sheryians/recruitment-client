interface RatingStarsProps {
  rating: number;
}

const RatingStars = ({ rating }: RatingStarsProps) => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= rating ? "⭐" : "☆"}
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
