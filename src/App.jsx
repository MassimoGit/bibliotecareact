import { useState } from "react";
import useStorageState from "./hooks/useStorageState";
import InputWithLabel from "./components/InputWithLabel";
import UnreadFilter from "./components/UnreadFilter";
import BookList from "./components/BookList";
import ReviewForm from "./components/ReviewForm";
import ReviewList from "./components/ReviewList";
import Notification from "./components/Notification";
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

  // State per la notifica — null quando non c'è nessuna notifica
  const [notification, setNotification] = useState(null);

  // Rimuove un libro dall'array usando .filter()
  const handleRemoveBook = (bookId) => {
    // Salva il titolo prima di filtrare, per mostrarlo nella notifica
    const removedBook = books.find((book) => book.id === bookId);
    setBooks(books.filter((book) => book.id !== bookId));
    if (removedBook) {
      setNotification({
        message: `"${removedBook.title}" rimosso dalla biblioteca`,
        type: "warning",
      });
    }
  };

  // Chiude la notifica riportando lo state a null
  const handleDismissNotification = () => {
    setNotification(null);
  };

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
    <div className="card shadow">
      <div className="card-header bg-primary text-white">
        <h1 className="h3 mb-0">La Mia Biblioteca Personale</h1>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onDismiss={handleDismissNotification}
        />
      )}

      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <InputWithLabel id="search" value={searchTerm} onInputChange={setSearchTerm}   isFocused>
              <strong>
                <i className="bi bi-search me-1"></i>
                Cerca per titolo:</strong>
            </InputWithLabel>
          </div>
          <div className="col-md-6">
            <InputWithLabel id="author" value={authorFilter} onInputChange={setAuthorFilter} isFocused={false}>
              <strong><i className="bi bi-person me-1"></i>Filtra per autore:</strong>
            </InputWithLabel>
          </div>
        </div>
        <UnreadFilter checked={showOnlyUnread} onChange={setShowOnlyUnread} />

        <h4 className="mb-3">I Miei Libri</h4>
        <p className="text-muted">{getResultMessage()}</p>
        <BookList books={filteredBooks} onMarkAsRead={handleMarkAsRead} onRemoveBook={handleRemoveBook} />
      </div>

      <div className="card-body border-top">
        <ReviewForm onAddReview={handleAddReview} />
        <ReviewList reviews={reviews} />
      </div>

      <div className="card-footer text-center">
        <button className="btn btn-danger" onClick={handleClearHistory}><i className="bi bi-trash me-1"></i>Cancella Cronologia</button>
      </div>
    </div>
  );
};

export default App;
