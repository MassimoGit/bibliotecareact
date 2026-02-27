// BookItem E04: mostra dettagli di un singolo libro
const BookItem = ({ book, onMarkAsRead }) => (
  <li className="list-group-item">
    <h3>{book.title}</h3>
    <p>Autore: {book.author}</p>
    <p>Pagine: {book.pages}</p>
    <p>Genere: {book.genre}</p>
    <p>{book.read ? " Letto" : "○ Da leggere"}</p>
    {!book.read && (
      <button onClick={() => onMarkAsRead(book.id)}>
        Segna come Letto
      </button>
    )}
    <button
      onClick={() =>
        console.log("Mostra dettagli cliccato! Libro:", book.title)
      }
    >
      Mostra Dettagli
    </button>
  </li>
);

export default BookItem;
