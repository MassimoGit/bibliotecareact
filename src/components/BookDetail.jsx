import { useState, useEffect } from "react";
import { fetchBookById } from "../data/books";

// BookDetail: carica e mostra i dettagli di un singolo libro in modo asincrono
const BookDetail = ({ bookId, onClose }) => {
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const caricaDettaglio = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const dettaglio = await fetchBookById(bookId);
        setBook(dettaglio);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    caricaDettaglio();
  }, [bookId]);

  // Early return: loading
  if (isLoading) {
    return (
      <div className="card mb-3">
        <div className="card-body text-center">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <span className="ms-2">Caricamento dettagli...</span>
        </div>
      </div>
    );
  }

  // Early return: errore
  if (error) {
    return (
      <div className="alert alert-danger mb-3" role="alert">
        Errore: {error}
      </div>
    );
  }

  // Early return: dati non ancora disponibili
  if (!book) {
    return null;
  }

  // Rendering: dati ricevuti
  return (
    <div className="card mb-3 border-primary">
      <div className="card-header d-flex justify-content-between align-items-center">
        <strong><i className="bi bi-book me-1"></i>Dettaglio Libro</strong>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={onClose}
        >
          <i className="bi bi-x-lg me-1"></i>Chiudi
        </button>
      </div>
      <div className="card-body">
        <h5 className="card-title">{book.title}</h5>
        <p className="card-text">Autore: {book.author}</p>
        <p className="card-text">Pagine: {book.pages}</p>
        <p className="card-text">Genere: {book.genre}</p>
        <p className="card-text">
          Stato:{" "}
          <span className={`badge ${book.read ? "bg-success" : "bg-warning text-dark"}`}>
            {book.read ? "Letto" : "Da leggere"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default BookDetail;
