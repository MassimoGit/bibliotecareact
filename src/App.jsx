import * as React from "react";

// SearchBar: controlled component — riceve value, onSearch
const SearchBar = (props) => (
  <div>
    <label htmlFor="search">Cerca un libro: </label>
    <input
      id="search"
      type="text"
      placeholder="Inserisci titolo o autore..."
      value={props.value}
      onChange={(e) => props.onSearch(e.target.value)}
    />
  </div>
);

// Task 4: checkbox "Solo non letti"
const UnreadFilter = (props) => (
  <div>
    <label>
      <input
        type="checkbox"
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
      />{" "}
      Mostra solo libri da leggere
    </label>
  </div>
);

// Task 5: BookItem riceve anche onMarkAsRead
const BookItem = (props) => (
  <li>
    <h3>{props.book.title}</h3>
    <p>Autore: {props.book.author}</p>
    <p>Pagine: {props.book.pages}</p>
    <p>Genere: {props.book.genre}</p>
    {/* Task 5: indicatore stato lettura */}
    <p>{props.book.read ? "✓ Letto" : "○ Da leggere"}</p>
    {/* Task 5: button visibile solo se non ancora letto */}
    {!props.book.read && (
      <button onClick={() => props.onMarkAsRead(props.book.id)}>
        Segna come Letto
      </button>
    )}
    <button
      onClick={() =>
        console.log("Mostra dettagli cliccato! Libro:", props.book.title)
      }
    >
      Mostra Dettagli
    </button>
  </li>
);

// BookList: concise body — passa onMarkAsRead in giù a BookItem
const BookList = (props) => (
  <ul>
    {props.books.map((book) => (
      <BookItem key={book.id} book={book} onMarkAsRead={props.onMarkAsRead} />
    ))}
  </ul>
);

// Task 6: ReviewForm con state locale per i campi (controlled)
// Riceve onAddReview dal parent
const ReviewForm = (props) => {
  const [bookTitle, setBookTitle] = React.useState("");
  const [reviewText, setReviewText] = React.useState("");

  const handleSubmit = () => {
    if (bookTitle.trim() === "" || reviewText.trim() === "") return;
    props.onAddReview({ bookTitle, reviewText });
    // reset campi dopo submit
    setBookTitle("");
    setReviewText("");
  };

  return (
    <div>
      <h2>Aggiungi una Recensione</h2>
      <label htmlFor="bookTitle">Titolo del libro:</label>
      <input
        id="bookTitle"
        type="text"
        placeholder="Es. 1984"
        value={bookTitle}
        onChange={(e) => setBookTitle(e.target.value)}
      />
      <br />
      <label htmlFor="review">La tua recensione:</label>
      <textarea
        id="review"
        placeholder="Scrivi qui la tua recensione..."
        rows="4"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      ></textarea>
      <br />
      <button onClick={handleSubmit}>Pubblica Recensione</button>
    </div>
  );
};

// Task 6: lista recensioni salvate
const ReviewList = (props) => {
  if (props.reviews.length === 0) return null;

  return (
    <div>
      <h3>Recensioni pubblicate</h3>
      <ul>
        {props.reviews.map((review) => (
          <li key={review.id}>
            <strong>{review.bookTitle}</strong>
            <p>{review.reviewText}</p>
            <small>{review.timestamp}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  let lastId = 0;
  // Task 5: books come state — aggiunta proprietà read
  // Oltre lo state abbiamo read true / false per ogni libro che indica se letto o meno
  const [books, setBooks] = React.useState([
    {
      id: 1,
      title: "1984",
      author: "George Orwell",
      pages: 328,
      genre: "Distopia",
      read: true,
    },
    {
      id: 2,
      title: "Il Signore degli Anelli",
      author: "J.R.R. Tolkien",
      pages: 1178,
      genre: "Fantasy",
      read: false,
    },
    {
      id: 3,
      title: "Il Piccolo Principe",
      author: "Antoine de Saint-Exupéry",
      pages: 96,
      genre: "Favola",
      read: true,
    },
    {
      id: 4,
      title: "Fondazione",
      author: "Isaac Asimov",
      pages: 255,
      genre: "Fantascienza",
      read: false,
    },
    {
      id: 5,
      title: "L'Alchimista",
      author: "Paulo Coelho",
      pages: 208,
      genre: "Romanzo",
      read: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = React.useState("");

  // Task 4: state per il filtro "solo non letti"
  const [showOnlyUnread, setShowOnlyUnread] = React.useState(false);

  // Task 6: state per le recensioni
  const [reviews, setReviews] = React.useState([]);

  // Task 5: cambia read di un libro tramite .map()
  const handleMarkAsRead = (id) => {
    setBooks(
      books.map((book) => (book.id === id ? { ...book, read: true } : book)),
    );
  };

  // Task 6: aggiunge una recensione all'array con timestamp
  const handleAddReview = ({ bookTitle, reviewText }) => {
    const newReview = {
      id: ++lastId,
      bookTitle,
      reviewText,
      timestamp: new Date().now(),
    };
    setReviews([...reviews, newReview]);
  };

  // Task 4: filtraggio — prima per searchTerm, poi per read
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
      {/* Task 4: checkbox filtro non letti */}
      <UnreadFilter checked={showOnlyUnread} onChange={setShowOnlyUnread} />

      <hr />

      <h2>I Miei Libri</h2>
      <p>{getResultMessage()}</p>
      {/* Task 5: passa onMarkAsRead giù a BookList */}
      <BookList books={filteredBooks} onMarkAsRead={handleMarkAsRead} />

      <hr />

      {/* Task 6: ReviewForm riceve callback, ReviewList riceve l'array */}
      <ReviewForm onAddReview={handleAddReview} />
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default App;
