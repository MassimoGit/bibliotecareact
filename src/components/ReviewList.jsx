// ReviewList E04: mostra le recensioni pubblicate
const ReviewList = ({ reviews }) => {
  if (reviews.length === 0) return null;

  return (
    <div>
      <h3>Recensioni pubblicate</h3>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <strong>{review.bookTitle}</strong>
            <p>{review.reviewText}</p>
            <small>{review.timestamp}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;
