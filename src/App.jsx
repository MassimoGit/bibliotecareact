import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import UnreadFilter from "./components/UnreadFilter";
import BookList from "./components/BookList";
import ReviewForm from "./components/ReviewForm";
import ReviewList from "./components/ReviewList";
import { books as initialBooks } from "./data/books";

const App = () => {

  // Task 5 (04): state per le recensioni — inizializza da localStorage
  const [reviews, setReviews] = useState(
    JSON.parse(localStorage.getItem("bibliotecaReviews") || "[]"),
  );

  // nextId parte dal massimo id esistente + 1
  const [nextId, setNextId] = useState(() => {
    const saved = JSON.parse(
      localStorage.getItem("bibliotecaReviews") || "[]",
    );
    return saved.length > 0 ? Math.max(...saved.map((r) => r.id)) + 1 : 1;
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

  // Task (L04): searchTerm — inizializza da localStorage
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem("bibliotecaSearch") || "",
  );

  // Task 4 (L04): showOnlyUnread — inizializza da localStorage
  const [showOnlyUnread, setShowOnlyUnread] = useState(
    JSON.parse(localStorage.getItem("bibliotecaShowUnread") || "false"),
  );

  // Task 3 (L04): salva searchTerm nel localStorage quando cambia
  useEffect(() => {
    localStorage.setItem("bibliotecaSearch", searchTerm);
  }, [searchTerm]);

  // Task 4 (L04): salva showOnlyUnread nel localStorage quando cambia
  useEffect(() => {
    localStorage.setItem(
      "bibliotecaShowUnread",
      JSON.stringify(showOnlyUnread),
    );
  }, [showOnlyUnread]);

  // Task 5 (L04): salva reviews nel localStorage quando cambiano
  useEffect(() => {
    localStorage.setItem("bibliotecaReviews", JSON.stringify(reviews));
  }, [reviews]);

  // Task 6 extra: cancella cronologia — rimuove dati da localStorage e resetta state
  const handleClearHistory = () => {
    localStorage.removeItem("bibliotecaSearch");
    localStorage.removeItem("bibliotecaShowUnread");
    localStorage.removeItem("bibliotecaReviews");
    setSearchTerm("");
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

  // Filtraggio — prima per searchTerm, poi per read
  const filteredBooks = books
    .filter((book) => {
      const term = searchTerm.toLowerCase();
      return (
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term)
      );
    })
    .filter((book) => (showOnlyUnread ? !book.read : true));

  const getResultMessage = () => {
    if (filteredBooks.length === 0) return "Nessun libro trovato";
    if (searchTerm === "" && !showOnlyUnread)
      return `Mostrando tutti i ${books.length} libri`;
    return `Trovati ${filteredBooks.length} libri`;
  };

  return (
    <div>
      <h1>La Mia Biblioteca Personale</h1>

      <SearchBar value={searchTerm} onSearch={setSearchTerm} />
      <UnreadFilter checked={showOnlyUnread} onChange={setShowOnlyUnread} />

      <hr />

      <h2>I Miei Libri</h2>
      <p>{getResultMessage()}</p>
      <BookList books={filteredBooks} onMarkAsRead={handleMarkAsRead} />

      <hr />

      <ReviewForm onAddReview={handleAddReview} />
      <ReviewList reviews={reviews} />

      <hr />

      <button onClick={handleClearHistory}>Cancella Cronologia</button>
    </div>
  );
};

export default App;
