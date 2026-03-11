import BookItem from "./BookItem.jsx";

// BookList E04: renderizza la lista dei libri
const BookList = ({ books, onMarkAsRead, onRemoveBook, onSelectBook }) => (
  <ul className="list-group">
    {books.map((book) => (
      <BookItem key={book.id} book={book} onMarkAsRead={onMarkAsRead} onRemoveBook={onRemoveBook} onSelectBook={onSelectBook} />
    ))}
  </ul>
);

export default BookList;
