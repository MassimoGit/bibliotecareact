import { API_BASE_URL, USER_ID } from '../api/config';

const fetchBooks = async () => {
    const response = await fetch(API_BASE_URL + '/books?user_id=' + USER_ID);
    if (!response.ok) {
        throw new Error('Errore nel caricamento dei libri: ' + response.status);
    }
    const data = await response.json();
    return data;
};

const fetchBookById = async (bookId) => {
    const response = await fetch(API_BASE_URL + '/book/' + bookId + '?user_id=' + USER_ID);
    if (!response.ok) {
        throw new Error('Libro non trovato: ' + response.status);
    }
    const data = await response.json();
    return data;
};

export { fetchBooks, fetchBookById };
