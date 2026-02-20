import { useState } from 'react';

// Task 1: SearchBar è ora un controlled component (Task 2)
// Riceve value e onSearch come props
const SearchBar = ({ value, onSearch }) => {
  const handleSearch = (event) => {
    onSearch(event.target.value);
  };

  return (
    <div>
      <label htmlFor="search">Cerca un libro: </label>
      <input
        id="search"
        type="text"
        placeholder="Inserisci titolo o autore..."
        value={value}
        onChange={handleSearch}
      />
    </div>
  );
};

// Task 1: BookItem estratto da BookList — riceve un singolo book tramite props
const BookItem = ({ book }) => {
  const handleShowDetails = () => {
    console.log("Mostra dettagli cliccato! Libro:", book.title);
  };

  return (
    <li>
      <h3>{book.title}</h3>
      <p>Autore: {book.author}</p>
      <p>Pagine: {book.pages}</p>
      <p>Genere: {book.genre}</p>
      <button onClick={handleShowDetails}>Mostra Dettagli</button>
    </li>
  );
};

// Task 1: BookList riceve books tramite props (non più variabile globale)
const BookList = ({ books }) => (
  <ul>
    {books.map((book) => (
      <BookItem key={book.id} book={book} />
    ))}
  </ul>
);

const ReviewForm = () => {
  const handleTitleChange = (event) => {
    console.log("Titolo:", event.target.value);
  };

  const handleReviewChange = (event) => {
    console.log("Recensione:", event.target.value);
  };

  const handleSubmit = () => {
    console.log("Recensione inviata!");
  };

  return (
    <div>
      <h2>Aggiungi una Recensione</h2>
      <label htmlFor="bookTitle">Titolo del libro:</label>
      <input
        id="bookTitle"
        type="text"
        placeholder="Es. 1984"
        onChange={handleTitleChange}
      />
      <br />
      <label htmlFor="review">La tua recensione:</label>
      <textarea
        id="review"
        placeholder="Scrivi qui la tua recensione..."
        rows="4"
        onChange={handleReviewChange}
      ></textarea>
      <br />
      <button onClick={handleSubmit}>Pubblica Recensione</button>
    </div>
  );
};

// Task 1: books ora è dentro App, non più variabile globale
const App = () => {
  const books = [
    { id: 1, title: "1984", author: "George Orwell", pages: 328, genre: "Distopia" },
    { id: 2, title: "Il Signore degli Anelli", author: "J.R.R. Tolkien", pages: 1178, genre: "Fantasy" },
    { id: 3, title: "Il Piccolo Principe", author: "Antoine de Saint-Exupéry", pages: 96, genre: "Favola" },
    { id: 4, title: "Fondazione", author: "Isaac Asimov", pages: 255, genre: "Fantascienza" },
    { id: 5, title: "L'Alchimista", author: "Paulo Coelho", pages: 208, genre: "Romanzo" },
  ];

  // Task 2: state per il termine di ricerca
  const [searchTerm, setSearchTerm] = useState('');

  // Task 2: filtraggio case-insensitive su titolo e autore
  const filteredBooks = books.filter((book) => {
    const term = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term)
    );
  });

  // Task 3: messaggio risultati dinamico
  const getResultMessage = () => {
    if (filteredBooks.length === 0) return "Nessun libro trovato";
    if (searchTerm === '') return `Mostrando tutti i ${books.length} libri`;
    return `Trovati ${filteredBooks.length} libri`;
  };

  return (
    <div>
      <h1>La Mia Biblioteca Personale</h1>

      {/* Task 2: SearchBar controlled — riceve value e callback onSearch */}
      <SearchBar value={searchTerm} onSearch={setSearchTerm} />

      <hr />

      <h2>I Miei Libri</h2>
      {/* Task 3: contatore risultati */}
      <p>{getResultMessage()}</p>

      {/* Task 1 + 2: BookList riceve i libri filtrati */}
      <BookList books={filteredBooks} />

      <hr />
      <ReviewForm />
    </div>
  );
};

export default App;
