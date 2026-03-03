import BookItem from "./BookItem";

// BookList E04: renderizza la lista dei libri
const BookList = ({ books, onMarkAsRead, onRemoveBook }) => (
  <ul className="list-group">
    {books.map((book) => (
      <BookItem key={book.id} book={book} onMarkAsRead={onMarkAsRead} onRemoveBook={onRemoveBook} />
    ))}
  </ul>
);

export default BookList;
