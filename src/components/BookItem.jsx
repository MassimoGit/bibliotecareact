// BookItem E04: mostra dettagli di un singolo libro
const BookItem = ({ book, onMarkAsRead, onRemoveBook }) => {


  const handleMarkAsRead = () => {
    // chiamo la prop onMarkAsRead passando l'id del libro corrente
    onMarkAsRead(book.id);
  };

  const handleRemoveBook = () => {
    // chiamo la prop onRemoveBook passando l'id del libro corrente
    onRemoveBook(book.id);
  };

  const handleShowDetails = () => {
    // placeholder: per ora stampa in console il titolo del libro
    console.log("Mostra dettagli cliccato! Libro:", book.title);
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-start">
      <div >
        <h5 className="mb-1">{book.title}</h5>
        <p className="mb-1 text-muted">Autore: {book.author}</p>
        <small>
          Pagine: {book.pages} | Genere: {book.genre}
        </small>
        <br />
        {/*
          className dinamico — qui succedono due cose separate:

          1) Template literal (i backtick `...`):
             ${...} e interpolazione di stringa — prende il RISULTATO dell'espressione
             dentro le graffe e lo incolla nella stringa. Non decide nulla, incolla e basta.

          2) Operatore ternario (dentro il ${...}):
             book.read ? "bg-success" : "bg-warning text-dark"
             QUESTO e quello che decide quale classe usare.
             Se book.read e true  -> il ternario restituisce "bg-success"
             Se book.read e false -> il ternario restituisce "bg-warning text-dark"

          Poi ${...} prende quel risultato e lo incolla dopo "badge mt-1 ".
          Risultato finale: "badge mt-1 bg-success" oppure "badge mt-1 bg-warning text-dark"
        */}
        <span
          className={`badge mt-1 ${book.read ? "bg-success" : "bg-warning text-dark"}`}
        >
          {/* Anche il contenuto del badge cambia con un ternario:
              - se letto: icona check + testo "Letto"
              - se non letto: icona bookmark + testo "Da leggere"
              Usiamo <> </> (Fragment) perche il ternario deve restituire UN solo elemento */}
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
          className="btn btn-outline-danger"
          onClick={handleRemoveBook}
        >
          <i className="bi bi-trash me-1"></i>Rimuovi
        </button>
      </div>
    </li>
  );
};

export default BookItem;
