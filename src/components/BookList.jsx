import BookItem from "./BookItem.jsx";

// BookList 09c: passa onElimina e onBookModificato ai figli
const BookList = ({ books, onMarkAsRead, onElimina, onBookModificato, onSelectBook }) => (
  <ul className="list-group">
    {books.map((book) => (
      <BookItem
        key={book.id}
        book={book}
        onMarkAsRead={onMarkAsRead}
        onElimina={onElimina}
        onBookModificato={onBookModificato}
        onSelectBook={onSelectBook}
      />
    ))}
  </ul>
);

export default BookList;
