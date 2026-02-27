// ReviewList E04: mostra le recensioni pubblicate
const ReviewList = ({ reviews }) => {
  if (reviews.length === 0) return null;

  return (
    <>
      <h4 className="mt-4 mb-3">Recensioni pubblicate</h4>
      <ul className="list-group">
        {reviews.map((review) => (
          <li key={review.id} className="list-group-item">
            <strong>{review.bookTitle}</strong>
            <p className="mb-1">{review.reviewText}</p>
            <small className="text-muted">{review.timestamp}</small>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ReviewList;
