// BookItem 09b: aggiunto bottone Modifica e Elimina
const BookItem = ({ book, onMarkAsRead, onDeleteBook, onEditBook, onSelectBook }) => {

  const handleMarkAsRead = () => {
    onMarkAsRead(book.id);
  };

  const handleShowDetails = () => {
    onSelectBook(book.id);
  };

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
          >
            <i className="bi bi-check2-circle me-1"></i>Segna come Letto
          </button>
        )}
        <button
          className="btn btn-outline-secondary"
          onClick={handleShowDetails}
        >
          <i className="bi bi-info-circle me-1"></i>Mostra Dettagli
        </button>
        <button
          className="btn btn-outline-warning"
          onClick={() => onEditBook(book)}
        >
          <i className="bi bi-pencil me-1"></i>Modifica
        </button>
        <button
          className="btn btn-outline-danger"
          onClick={() => onDeleteBook(book.id)}
        >
          <i className="bi bi-trash me-1"></i>Elimina
        </button>
      </div>
    </li>
  );
};

export default BookItem;
