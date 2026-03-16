import { useState, useReducer, useEffect } from 'react';
import { fetchBooks, createBook, toggleBookRead } from '../data/books';

const booksReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, error: null };

    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, error: null, books: action.payload };

    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };

    case 'ADD_BOOK':
      return { ...state, books: [action.payload, ...state.books] };

    case 'UPDATE_BOOK':
      return {
        ...state,
        books: state.books.map((b) =>
          b.id === action.payload.id ? action.payload : b
        ),
      };

    case 'REMOVE_BOOK':
      return {
        ...state,
        books: state.books.filter((b) => b.id !== action.payload),
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      throw new Error('Azione sconosciuta: ' + action.type);
  }
};

const useBooks = () => {
  const [state, dispatch] = useReducer(booksReducer, {
    books: [],
    isLoading: false,
    error: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const caricaLibri = async (search = '') => {
    dispatch({ type: 'FETCH_INIT' });

    try {
      const libriCaricati = await fetchBooks(search);
      dispatch({ type: 'FETCH_SUCCESS', payload: libriCaricati });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
    }
  };

  useEffect(() => {
    caricaLibri();
  }, []);

  const handleAddBook = async (newBookData) => {
    setIsSubmitting(true);

    try {
      const createdBook = await createBook(newBookData);
      dispatch({ type: 'ADD_BOOK', payload: createdBook });
      return createdBook;
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookModificato = (bookAggiornato) => {
    dispatch({ type: 'UPDATE_BOOK', payload: bookAggiornato });
  };

  const handleEliminaBook = (bookId) => {
    const deletedBook = state.books.find((b) => b.id === bookId);
    dispatch({ type: 'REMOVE_BOOK', payload: bookId });
    return deletedBook;
  };

  const handleMarkAsRead = async (bookId) => {
    try {
      const updatedBook = await toggleBookRead(bookId, true);
      dispatch({ type: 'UPDATE_BOOK', payload: updatedBook });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return {
    books: state.books,
    isLoading: state.isLoading,
    error: state.error,
    isSubmitting,
    caricaLibri,
    handleAddBook,
    handleBookModificato,
    handleEliminaBook,
    handleMarkAsRead,
    clearError,
  };
};

export default useBooks;
