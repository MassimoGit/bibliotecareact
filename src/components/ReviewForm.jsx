import { useState } from "react";

// ReviewForm E04: form con state locale per aggiungere recensioni
const ReviewForm = ({ onAddReview }) => {
  const [bookTitle, setBookTitle] = useState("");
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = () => {
    if (bookTitle.trim() === "" || reviewText.trim() === "") return;
    onAddReview({ bookTitle, reviewText });
    setBookTitle("");
    setReviewText("");
  };

  return (
    <>
      <h2>Aggiungi una Recensione</h2>
      <label htmlFor="bookTitle">Titolo del libro:</label>
      <input
        id="bookTitle"
        type="text"
        placeholder="Es. 1984"
        value={bookTitle}
        onChange={(e) => setBookTitle(e.target.value)}
      />
      <br />
      <label htmlFor="review">La tua recensione:</label>
      <textarea
        id="review"
        placeholder="Scrivi qui la tua recensione..."
        rows="4"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      ></textarea>
      <br />
      <button onClick={handleSubmit}>Pubblica Recensione</button>
    </>
  );
};

export default ReviewForm;
