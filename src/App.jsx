import { useState } from "react";
import useStorageState from "./hooks/useStorageState";
import InputWithLabel from "./components/InputWithLabel";
import UnreadFilter from "./components/UnreadFilter";
import BookList from "./components/BookList";
import ReviewForm from "./components/ReviewForm";
import ReviewList from "./components/ReviewList";
import { books as initialBooks } from "./data/books";

const App = () => {

  // Task 2: searchTerm con useStorageState
  const [searchTerm, setSearchTerm] = useStorageState('bibliotecaSearch', '');

  // Task 8: filtro autore con useStorageState
  const [authorFilter, setAuthorFilter] = useStorageState('bibliotecaAuthor', '');

  // Task 3: showOnlyUnread con useStorageState
  const [showOnlyUnread, setShowOnlyUnread] = useStorageState('bibliotecaShowUnread', false);

  // Task 4: reviews con useStorageState
  const [reviews, setReviews] = useStorageState('bibliotecaReviews', []);

  // nextId parte dal massimo id esistente + 1
  const [nextId, setNextId] = useState(() => {
    const saved = JSON.parse(
      localStorage.getItem("bibliotecaReviews") || "[]",
    );
    return saved.length > 0 ? saved.reduce((max, item) => Math.max(max, item.id), saved[0].id) + 1 : 1;
  });

  // Aggiunge una recensione all'array con timestamp
  const handleAddReview = ({ bookTitle, reviewText }) => {
    const newReview = {
      id: nextId,
      bookTitle,
      reviewText,
      timestamp: new Date().toLocaleString(),
    };
    setReviews([...reviews, newReview]);
    setNextId(nextId + 1);
  };

  // Books come state
  const [books, setBooks] = useState(initialBooks);

  // Cancella cronologia — rimuove dati da localStorage e resetta state
  const handleClearHistory = () => {
    localStorage.removeItem("bibliotecaSearch");
    localStorage.removeItem("bibliotecaAuthor");
    localStorage.removeItem("bibliotecaShowUnread");
    localStorage.removeItem("bibliotecaReviews");
    setSearchTerm("");
    setAuthorFilter("");
    setShowOnlyUnread(false);
    setReviews([]);
    setNextId(1);
  };

  // Cambia read di un libro tramite .map()
  const handleMarkAsRead = (id) => {
    setBooks(
      books.map((book) => (book.id === id ? { ...book, read: true } : book)),
    );
  };

  // Filtraggio — per titolo, autore e read
  const filteredBooks = books
    .filter((book) => book.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((book) => book.author.toLowerCase().includes(authorFilter.toLowerCase()))
    .filter((book) => (showOnlyUnread ? !book.read : true));

  const getResultMessage = () => {
    if (filteredBooks.length === 0) return "Nessun libro trovato";
    if (searchTerm === "" && authorFilter === "" && !showOnlyUnread)
      return `Mostrando tutti i ${books.length} libri`;
    return `Trovati ${filteredBooks.length} libri`;
  };

  return (
    <div className="card">
      <div className="card-header">
          <h1>La Mia Biblioteca Personale</h1>
          <InputWithLabel id="search" value={searchTerm} onInputChange={setSearchTerm}>
            <strong>Cerca per titolo:</strong>
          </InputWithLabel>
          <InputWithLabel id="author" value={authorFilter} onInputChange={setAuthorFilter}>
            <strong>Filtra per autore:</strong>
          </InputWithLabel>
          <UnreadFilter checked={showOnlyUnread} onChange={setShowOnlyUnread} />
      </div>

      <div className="card-body">
          <h2>I Miei Libri</h2>
          <p>{getResultMessage()}</p>
          <BookList books={filteredBooks} onMarkAsRead={handleMarkAsRead} />

      </div>

      <div>
          <ReviewForm onAddReview={handleAddReview} />
          <ReviewList reviews={reviews} />
      </div>

        <footer className="footer mt-auto py-3 bg-light">
            <button className="btn-danger btn" onClick={handleClearHistory}>Cancella Cronologia</button>
        </footer>

    </div>
  );
};

export default App;
