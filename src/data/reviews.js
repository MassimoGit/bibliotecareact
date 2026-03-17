// Modulo API per le recensioni
// Per ora le recensioni sono salvate in localStorage.
// Le funzioni sono predisposte per essere sostituite con chiamate fetch
// quando il backend supportera un endpoint /reviews.

const STORAGE_KEY = 'bibliotecaReviews';

const readFromStorage = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

const writeToStorage = (reviews) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
};

// GET: tutte le recensioni
const fetchReviews = async () => {
  // TODO: return await fetch(API_BASE_URL + '/reviews', { headers: AUTH_HEADER }).then(r => r.json());
  return readFromStorage();
};

// POST: crea una nuova recensione
const createReview = async (reviewData) => {
  // TODO: sostituire con fetch POST quando l'API sara disponibile
  const reviews = readFromStorage();
  const nextId = reviews.length > 0
    ? reviews.reduce((max, r) => Math.max(max, r.id), reviews[0].id) + 1
    : 1;

  const newReview = {
    id: nextId,
    bookTitle: reviewData.bookTitle,
    reviewText: reviewData.reviewText,
    timestamp: new Date().toLocaleString(),
  };

  const updated = [...reviews, newReview];
  writeToStorage(updated);
  return newReview;
};

// DELETE: elimina tutte le recensioni (clear)
const clearReviews = async () => {
  // TODO: sostituire con fetch DELETE quando l'API sara disponibile
  localStorage.removeItem(STORAGE_KEY);
  return [];
};

export { fetchReviews, createReview, clearReviews };
