import { useState, useEffect } from "react";
import useStorageState from "./hooks/useStorageState";
import InputWithLabel from "./components/InputWithLabel";
import UnreadFilter from "./components/UnreadFilter";
import BookList from "./components/BookList";
import BookDetail from "./components/BookDetail";
import ReviewForm from "./components/ReviewForm";
import ReviewList from "./components/ReviewList";
import Notification from "./components/Notification";
import { fetchBooks } from "./data/books";

const App = () => {

  // --- State per i libri (ora parte vuoto, verra riempito dalla "API") ---
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- State per il dettaglio libro ---
  const [selectedBookId, setSelectedBookId] = useState(null);

  // --- State per il form di inserimento libro ---
  const [nuovoLibro, setNuovoLibro] = useState({
    title: '',
    author: '',
    pages: '',
    genre: ''
  });

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

  // --- Handler per il form di inserimento ---
  const handleNuovoLibroChange = (event) => {
    const { name, value } = event.target;
    setNuovoLibro({
      ...nuovoLibro,
      [name]: value
    });
  };

  const handleAddBook = (event) => {
    event.preventDefault();
    if (!nuovoLibro.title.trim() || !nuovoLibro.author.trim()) {
      return;
    }
    const libroCompleto = {
      id: Date.now(),
      title: nuovoLibro.title.trim(),
      author: nuovoLibro.author.trim(),
      pages: Number(nuovoLibro.pages),
      genre: nuovoLibro.genre,
      read: false
    };
    setBooks([libroCompleto, ...books]);
    setNotification({
      message: '"' + nuovoLibro.title.trim() + '" aggiunto!',
      type: "success",
    });
    setNuovoLibro({
      title: '',
      author: '',
      pages: '',
      genre: ''
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

                <div className="card mb-3">
                  <div className="card-header">
                    <strong><i className="bi bi-plus-circle me-1"></i>Aggiungi un Libro</strong>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleAddBook}>
                      <div className="row g-2">
                        <div className="col-md-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Titolo *"
                            name="title"
                            value={nuovoLibro.title}
                            onChange={handleNuovoLibroChange}
                          />
                        </div>
                        <div className="col-md-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Autore *"
                            name="author"
                            value={nuovoLibro.author}
                            onChange={handleNuovoLibroChange}
                          />
                        </div>
                        <div className="col-md-2">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Pagine"
                            name="pages"
                            value={nuovoLibro.pages}
                            onChange={handleNuovoLibroChange}
                          />
                        </div>
                        <div className="col-md-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Genere"
                            name="genre"
                            value={nuovoLibro.genre}
                            onChange={handleNuovoLibroChange}
                          />
                        </div>
                        <div className="col-md-2">
                          <button
                            type="submit"
                            className="btn btn-success w-100"
                            disabled={!nuovoLibro.title.trim() || !nuovoLibro.author.trim()}
                          >
                            <i className="bi bi-plus-lg me-1"></i>Aggiungi
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

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
