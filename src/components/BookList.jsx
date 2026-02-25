import BookItem from "./BookItem";

// BookList E04: renderizza la lista dei libri
const BookList = ({ books, onMarkAsRead }) => (
  <ul>
    {books.map((book) => (
      <BookItem key={book.id} book={book} onMarkAsRead={onMarkAsRead} />
    ))}
  </ul>
);

export default BookList;
