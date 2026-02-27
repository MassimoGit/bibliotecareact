import { useState } from "react";

// ReviewForm E04: form con state locale per aggiungere recensioni
const ReviewForm = ({ onAddReview }) => {
  const [bookTitle, setBookTitle] = useState("");
  const [reviewText, setReviewText] = useState("");

  const handleTitleChange = (e) => {
    // aggiorno lo state locale del titolo con il valore digitato
    setBookTitle(e.target.value);
  };

  const handleTextChange = (e) => {
    // aggiorno lo state locale della recensione con il valore digitato
    setReviewText(e.target.value);
  };

  const handleSubmit = () => {
    if (bookTitle.trim() === "" || reviewText.trim() === "") return;
    onAddReview({ bookTitle, reviewText });
    setBookTitle("");
    setReviewText("");
  };

  return (
    <>
      <h4 className="mb-3"><i className="bi bi-chat-left-text me-2"></i>Aggiungi una Recensione</h4>
      <div className="mb-3">
        <label htmlFor="bookTitle" className="form-label">Titolo del libro:</label>
        <input
          id="bookTitle"
          type="text"
          className="form-control"
          placeholder="Es. 1984"
          value={bookTitle}
          onChange={handleTitleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="review" className="form-label">La tua recensione:</label>
        <textarea
          id="review"
          className="form-control"
          placeholder="Scrivi qui la tua recensione..."
          rows="4"
          value={reviewText}
          onChange={handleTextChange}
        ></textarea>
      </div>
      <button className="btn btn-primary" onClick={handleSubmit}><i className="bi bi-send me-1"></i>Pubblica Recensione</button>
    </>
  );
};

export default ReviewForm;
