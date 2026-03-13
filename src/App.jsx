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
import { fetchBooks, createBook, toggleBookRead } from "./data/books";

const App = () => {

  // --- State per i libri ---
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- State per il dettaglio libro ---
  const [selectedBookId, setSelectedBookId] = useState(null);

  // --- State per l'invio del form ---
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [notification, setNotification] = useState(null);

  // --- Caricamento asincrono dei libri (GET con ricerca server-side) ---
  const caricaLibri = async (search = '') => {
    setIsLoading(true);
    setError(null);

    try {
      const libriCaricati = await fetchBooks(search);
      setBooks(libriCaricati);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    caricaLibri();
  }, []);

  // --- Ricerca server-side: submit del form ---
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    caricaLibri(searchTerm);
  };

  // --- POST: Aggiungere un libro ---
  const handleAddBook = async (newBookData) => {
    setIsSubmitting(true);

    try {
      const createdBook = await createBook(newBookData);
      setBooks([createdBook, ...books]);
      setNotification({
        message: '"' + createdBook.title + '" aggiunto!',
        type: "success",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Callback per BookItem: aggiorna libro dopo modifica PUT ---
  const handleBookModificato = (bookAggiornato) => {
    setBooks(
      books.map((b) =>
        b.id === bookAggiornato.id ? bookAggiornato : b
      )
    );
  };

  // --- Callback per BookItem: rimuovi libro dopo DELETE ---
  const handleEliminaBook = (bookId) => {
    const deletedBook = books.find((b) => b.id === bookId);
    setBooks(books.filter((b) => b.id !== bookId));
    if (deletedBook) {
      setNotification({
        message: '"' + deletedBook.title + '" eliminato!',
        type: "danger",
      });
    }
  };

  // --- PATCH: Segnare come letto ---
  const handleMarkAsRead = async (bookId) => {
    try {
      const updatedBook = await toggleBookRead(bookId, true);
      setBooks(books.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Handlers vari ---
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

  const handleSelectBook = (bookId) => {
    setSelectedBookId(bookId);
  };

  const handleCloseDetail = () => {
    setSelectedBookId(null);
  };

  // --- Filtraggio client-side (autore e non letti; il titolo è filtrato dal server) ---
  const filteredBooks = books
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
              <span>Errore: {error}</span>
              <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => setError(null)}
              >
                <i className="bi bi-x-lg me-1"></i>Chiudi
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
                <form onSubmit={handleSearchSubmit} className="mb-3">
                  <div className="row align-items-end">
                    <div className="col-md-8">
                      <InputWithLabel id="search" value={searchTerm} onInputChange={setSearchTerm} isFocused>
                        <strong>
                          <i className="bi bi-search me-1"></i>
                          Cerca per titolo:</strong>
                      </InputWithLabel>
                    </div>
                    <div className="col-md-4 mb-3">
                      <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                            Cerco...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-search me-1"></i>Cerca
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-md-6">
                    <InputWithLabel id="author" value={authorFilter} onInputChange={setAuthorFilter} isFocused={false}>
                      <strong><i className="bi bi-person me-1"></i>Filtra per autore:</strong>
                    </InputWithLabel>
                  </div>
                </div>
                <UnreadFilter checked={showOnlyUnread} onChange={setShowOnlyUnread} />

                <AddBookForm onAddBook={handleAddBook} isSubmitting={isSubmitting} />

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
                    onElimina={handleEliminaBook}
                    onBookModificato={handleBookModificato}
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
