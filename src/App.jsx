import { useState, useEffect } from "react";
import useStorageState from "./hooks/useStorageState";
import InputWithLabel from "./components/InputWithLabel";
import UnreadFilter from "./components/UnreadFilter";
import BookList from "./components/BookList";
import BookDetail from "./components/BookDetail";
import ReviewForm from "./components/ReviewForm";
import ReviewList from "./components/ReviewList";
import Notification from "./components/Notification";
import AddBookForm from "./components/AddBookForm";
import { fetchBooks } from "./data/books";

const App = () => {

  // --- State per i libri (ora parte vuoto, verra riempito dalla "API") ---
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- State per il dettaglio libro ---
  const [selectedBookId, setSelectedBookId] = useState(null);

  // --- State persistenti con useStorageState ---
  const [searchTerm, setSearchTerm] = useStorageState('bibliotecaSearch', '');
  const [authorFilter, setAuthorFilter] = useStorageState('bibliotecaAuthor', '');
  const [showOnlyUnread, setShowOnlyUnread] = useStorageState('bibliotecaShowUnread', false);
  const [reviews, setReviews] = useStorageState('bibliotecaReviews', []);

  // nextId per le recensioni
  const [nextId, setNextId] = useState(() => {
    const saved = JSON.parse(
        localStorage.getItem("bibliotecaReviews") || "[]",
    );
    return saved.length > 0 ? saved.reduce((max, item) => Math.max(max, item.id), saved[0].id) + 1 : 1;
  });

  // --- Caricamento asincrono dei libri ---
  // Definita fuori dal useEffect per poterla riutilizzare nel bottone "Riprova"
  const caricaLibri = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const libriCaricati = await fetchBooks();
      setBooks(libriCaricati);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Al mount del componente, carica i libri
  useEffect(() => {
    caricaLibri();
  }, []);

  // --- Handlers ---
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

  const [notification, setNotification] = useState(null);

  const handleRemoveBook = (bookId) => {
    const removedBook = books.find((book) => book.id === bookId);
    setBooks(books.filter((book) => book.id !== bookId));
    if (removedBook) {
      setNotification({
        message: `"${removedBook.title}" rimosso dalla biblioteca`,
        type: "danger",
      });
    }
  };

  const handleDismissNotification = () => {
    setNotification(null);
  };

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

  const handleMarkAsRead = (id) => {
    setBooks(
        books.map((book) => (book.id === id ? { ...book, read: true } : book)),
    );
  };

  const handleSelectBook = (bookId) => {
    setSelectedBookId(bookId);
  };

  const handleCloseDetail = () => {
    setSelectedBookId(null);
  };

  const handleAddBook = (libroCompleto) => {
    setBooks([libroCompleto, ...books]);
    setNotification({
      message: '"' + libroCompleto.title + '" aggiunto!',
      type: "success",
    });
  };

  // --- Filtraggio ---
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

  // --- Rendering ---
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

        {error && (
            <div className="alert alert-danger d-flex align-items-center justify-content-between m-3" role="alert">
              <span>Errore durante il caricamento: {error}</span>
              <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={caricaLibri}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>Riprova
              </button>
            </div>
        )}

        {isLoading ? (
            <div className="card-body text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Caricamento...</span>
              </div>
              <p className="mt-2 text-muted">Caricamento libri in corso...</p>
            </div>
        ) : (
            <>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <InputWithLabel id="search" value={searchTerm} onInputChange={setSearchTerm} isFocused>
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

                <AddBookForm onAddBook={handleAddBook} />

                <h4 className="mb-3">I Miei Libri</h4>
                <p className="text-muted">{getResultMessage()}</p>

                {selectedBookId && (
                    <BookDetail
                        bookId={selectedBookId}
                        onClose={handleCloseDetail}
                    />
                )}

                <BookList
                    books={filteredBooks}
                    onMarkAsRead={handleMarkAsRead}
                    onRemoveBook={handleRemoveBook}
                    onSelectBook={handleSelectBook}
                />
              </div>

              <div className="card-body border-top">
                <ReviewForm onAddReview={handleAddReview} />
                <ReviewList reviews={reviews} />
              </div>

              <div className="card-footer text-center">
                <button className="btn btn-danger" onClick={handleClearHistory}>
                  <i className="bi bi-trash me-1"></i>Cancella Cronologia
                </button>
              </div>
            </>
        )}
      </div>
  );
};

export default App;
