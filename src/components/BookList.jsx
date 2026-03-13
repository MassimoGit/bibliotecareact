import BookItem from "./BookItem.jsx";

// BookList 09b: passa onDeleteBook, onEditBook ai figli
const BookList = ({ books, onMarkAsRead, onDeleteBook, onEditBook, onSelectBook }) => (
  <ul className="list-group">
    {books.map((book) => (
      <BookItem
        key={book.id}
        book={book}
        onMarkAsRead={onMarkAsRead}
        onDeleteBook={onDeleteBook}
        onEditBook={onEditBook}
        onSelectBook={onSelectBook}
      />
    ))}
  </ul>
);

export default BookList;
