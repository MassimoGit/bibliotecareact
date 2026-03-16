import { useState } from "react";
import useStorageState from "./hooks/useStorageState";
import useBooks from "./hooks/useBooks";
import useNotification from "./hooks/useNotification";
import InputWithLabel from "./components/InputWithLabel";
import UnreadFilter from "./components/UnreadFilter";
import BookList from "./components/BookList";
import BookDetail from "./components/BookDetail";
import ReviewForm from "./components/ReviewForm";
import ReviewList from "./components/ReviewList";
import Notification from "./components/Notification";
import AddBookForm from "./components/AddBookForm";

const App = () => {

  // --- Custom hook: stato e logica libri (useReducer interno) ---
  const {
    books, isLoading, error, isSubmitting,
    caricaLibri, handleAddBook, handleBookModificato,
    handleEliminaBook, handleMarkAsRead, clearError,
  } = useBooks();

  // --- Custom hook: notifiche ---
  const { notification, showNotification, dismissNotification } = useNotification();

  // --- State persistenti con useStorageState ---
  const [searchTerm, setSearchTerm] = useStorageState('bibliotecaSearch', '');
  const [authorFilter, setAuthorFilter] = useStorageState('bibliotecaAuthor', '');
  const [showOnlyUnread, setShowOnlyUnread] = useStorageState('bibliotecaShowUnread', false);
  const [reviews, setReviews] = useStorageState('bibliotecaReviews', []);

  // --- State per il dettaglio libro ---
  const [selectedBookId, setSelectedBookId] = useState(null);

  // nextId per le recensioni
  const [nextId, setNextId] = useState(() => {
    const saved = JSON.parse(
        localStorage.getItem("bibliotecaReviews") || "[]",
    );
    return saved.length > 0 ? saved.reduce((max, item) => Math.max(max, item.id), saved[0].id) + 1 : 1;
  });

  // --- Ricerca server-side: submit del form ---
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    caricaLibri(searchTerm);
  };

  // --- Wrapper: aggiunta libro + notifica ---
  const onAddBook = async (newBookData) => {
    const createdBook = await handleAddBook(newBookData);
    if (createdBook) {
      showNotification('"' + createdBook.title + '" aggiunto!', 'success');
    }
  };

  // --- Wrapper: eliminazione libro + notifica ---
  const onEliminaBook = (bookId) => {
    const deletedBook = handleEliminaBook(bookId);
    if (deletedBook) {
      showNotification('"' + deletedBook.title + '" eliminato!', 'danger');
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
                onDismiss={dismissNotification}
            />
        )}

        {error && (
            <div className="alert alert-danger d-flex align-items-center justify-content-between m-3" role="alert">
              <span>Errore: {error}</span>
              <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={clearError}
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

                <AddBookForm onAddBook={onAddBook} isSubmitting={isSubmitting} />

                <h4 className="mb-3">I Miei Libri</h4>
                <p className="text-muted">{getResultMessage()}</p>

                {selectedBookId && (
                    <BookDetail
                        bookId={selectedBookId}
                        onClose={() => setSelectedBookId(null)}
                    />
                )}

                <BookList
                    books={filteredBooks}
                    onMarkAsRead={handleMarkAsRead}
                    onElimina={onEliminaBook}
                    onBookModificato={handleBookModificato}
                    onSelectBook={(bookId) => setSelectedBookId(bookId)}
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
