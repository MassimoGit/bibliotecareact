const books = [
  {
    id: 1,
    title: "1984",
    author: "George Orwell",
    pages: 328,
    genre: "Distopia"
  },
  {
    id: 2,
    title: "Il Signore degli Anelli",
    author: "J.R.R. Tolkien",
    pages: 1178,
    genre: "Fantasy"
  },
  {
    id: 3,
    title: "Il Piccolo Principe",
    author: "Antoine de Saint-Exupéry",
    pages: 96,
    genre: "Favola"
  },
  {
    id: 4,
    title: "Fondazione",
    author: "Isaac Asimov",
    pages: 255,
    genre: "Fantascienza"
  },
  {
    id: 5,
    title: "L'Alchimista",
    author: "Paulo Coelho",
    pages: 208,
    genre: "Romanzo"
  }
];

// Step 2 + Step 5 + Step 6: SearchBar con arrow function (block body) e handleSearch
const SearchBar = () => {
  const handleSearch = (event) => {
    console.log(event.target.value);
  };

  return (
    <div>
      <label htmlFor="search">Cerca un libro: </label>
      <input
        id="search"
        type="text"
        placeholder="Inserisci titolo o autore..."
        onChange={handleSearch}
      />
    </div>
  );
};

// Step 3 + Step 5 + Step 7: BookList con arrow function (block body) e handleShowDetails
const BookList = () => {
  const handleShowDetails = (event, book) => {
    console.log("Mostra dettagli cliccato! Libro:", book.title);
  };

  return (
    <>
      <h2>I Miei Libri</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <h3>{book.title}</h3>
            <p>Autore: {book.author}</p>
            <p>Pagine: {book.pages}</p>
            <p>Genere: {book.genre}</p>
            <button onClick={(event) => handleShowDetails(event,book)}>
              Mostra Dettagli
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

//BookItem

// Step 4 + Step 5 + Step 8: ReviewForm con arrow function (block body) e tutti gli handlers
const RevkiewForm = () => {
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

// Step 5: App come arrow function con concise body
const App = () => (
  <div>
    <h1>La Mia Biblioteca Personale</h1>
    <SearchBar />
    <hr />
    <BookList />
    <hr />
    <ReviewForm />
  </div>
);

export default App;
