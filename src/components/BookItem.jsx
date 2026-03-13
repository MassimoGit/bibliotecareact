import { useState } from "react";
import { deleteBook, updateBook } from "../data/books";
import EditBookForm from "./EditBookForm";

// BookItem 09c: isDeleting locale, isEditing con early return, handleDelete async
const BookItem = ({ book, onMarkAsRead, onElimina, onBookModificato, onSelectBook }) => {

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleMarkAsRead = () => {
    onMarkAsRead(book.id);
  };

  const handleShowDetails = () => {
    onSelectBook(book.id);
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteBook(book.id);
      onElimina(book.id);
    } catch (errore) {
      alert('Errore: ' + errore.message);
      setIsDeleting(false);
    }
  };

  // PUT: salva le modifiche al server
  const handleSave = async (updatedData) => {
    try {
      const bookAggiornato = await updateBook(book.id, updatedData);
      onBookModificato(bookAggiornato);
      setIsEditing(false);
    } catch (errore) {
      alert('Errore: ' + errore.message);
    }
  };

  // Early return: se isEditing è true, mostra il form di modifica
  if (isEditing) {
    return (
      <EditBookForm
        book={book}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <li className="list-group-item d-flex justify-content-between align-items-start">
      <div>
        <h5 className="mb-1">{book.title}</h5>
        <p className="mb-1 text-muted">Autore: {book.author}</p>
        <small>
          Pagine: {book.pages} | Genere: {book.genre}
        </small>
        <br />
        <span
          className={`badge mt-1 ${book.read ? "bg-success" : "bg-warning text-dark"}`}
        >
          {book.read ? (
            <>
              <i className="bi bi-check-lg me-1"></i>Letto
            </>
          ) : (
            <>
              <i className="bi bi-bookmark me-1"></i>Da leggere
            </>
          )}
        </span>
      </div>
      <div className="btn-group-vertical btn-group-sm ms-2">
        {!book.read && (
          <button
            className="btn btn-outline-success"
            onClick={handleMarkAsRead}
            disabled={isDeleting}
          >
            <i className="bi bi-check2-circle me-1"></i>Segna come Letto
          </button>
        )}
        <button
          className="btn btn-outline-secondary"
          onClick={handleShowDetails}
          disabled={isDeleting}
        >
          <i className="bi bi-info-circle me-1"></i>Mostra Dettagli
        </button>
        <button
          className="btn btn-outline-warning"
          onClick={() => setIsEditing(true)}
          disabled={isDeleting}
        >
          <i className="bi bi-pencil me-1"></i>Modifica
        </button>
        <button
          className="btn btn-outline-danger"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" role="status"></span>
              Elimino...
            </>
          ) : (
            <>
              <i className="bi bi-trash me-1"></i>Elimina
            </>
          )}
        </button>
      </div>
    </li>
  );
};

export default BookItem;
