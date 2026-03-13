import { API_BASE_URL, USER_ID, AUTH_HEADER } from '../api/config';

// GET: tutti i libri (con ricerca opzionale per titolo)
const fetchBooks = async (search = '') => {
    let url = API_BASE_URL + '/books?user_id=' + USER_ID;

    if (search.trim() !== '') {
        url += '&search=' + encodeURIComponent(search.trim());
    }

    const response = await fetch(url, { headers: AUTH_HEADER });
    if (!response.ok) {
        throw new Error('Errore nel caricamento dei libri: ' + response.status);
    }
    return await response.json();
};

// GET: singolo libro per id
const fetchBookById = async (bookId) => {
    const response = await fetch(
        API_BASE_URL + '/books/' + bookId + '?user_id=' + USER_ID,
        { headers: AUTH_HEADER }
    );
    if (!response.ok) {
        throw new Error('Libro non trovato: ' + response.status);
    }
    return await response.json();
};

// POST: crea un nuovo libro
const createBook = async (bookData) => {
    const response = await fetch(API_BASE_URL + '/books', {
        method: 'POST',
        headers: AUTH_HEADER,
        body: JSON.stringify(bookData),
    });
    if (!response.ok) {
        throw new Error('Errore nella creazione del libro: ' + response.status);
    }
    return await response.json();
};

// PUT: modifica completa di un libro
const updateBook = async (bookId, bookData) => {
    const response = await fetch(API_BASE_URL + '/books/' + bookId, {
        method: 'PUT',
        headers: AUTH_HEADER,
        body: JSON.stringify(bookData),
    });
    if (!response.ok) {
        throw new Error('Errore nella modifica del libro: ' + response.status);
    }
    return await response.json();
};

// PATCH: modifica solo lo stato di lettura
const toggleBookRead = async (bookId, read) => {
    const response = await fetch(API_BASE_URL + '/books/' + bookId, {
        method: 'PATCH',
        headers: AUTH_HEADER,
        body: JSON.stringify({ read }),
    });
    if (!response.ok) {
        throw new Error('Errore nel cambio stato lettura: ' + response.status);
    }
    return await response.json();
};

// DELETE: elimina un libro
const deleteBook = async (bookId) => {
    const response = await fetch(API_BASE_URL + '/books/' + bookId, {
        method: 'DELETE',
        headers: AUTH_HEADER,
    });
    if (!response.ok) {
        throw new Error('Errore nella cancellazione: ' + response.status);
    }
    return await response.json();
};

export { fetchBooks, fetchBookById, createBook, updateBook, toggleBookRead, deleteBook };
