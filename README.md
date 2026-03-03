# La Mia Biblioteca Personale

App React per gestire una libreria personale con ricerca, filtri e recensioni.

---

## E04 — Refactoring e Persistenza

### Parte A: Refactoring Props

#### Props Destructuring (tutti i componenti)

Prima di E04, ogni componente riceveva `props` come oggetto e accedeva ai valori con `props.qualcosa`:

```jsx
// PRIMA
const SearchBar = (props) => (
  <input value={props.value} onChange={(e) => props.onSearch(e.target.value)} />
);
```

Dopo E04, le props vengono **estratte direttamente nella firma della funzione**:

```jsx
// DOPO
const SearchBar = ({ value, onSearch }) => (
  <input value={value} onChange={(e) => onSearch(e.target.value)} />
);
```

Vantaggi:
- Nessun `props.` nel corpo del componente
- Si vede subito quali props il componente si aspetta
- Codice più corto e leggibile

Componenti modificati: `SearchBar`, `UnreadFilter`, `BookItem`, `BookList`, `ReviewForm`, `ReviewList`.

---

### Parte B: Persistenza con localStorage

#### Concetto chiave: perché useEffect?

Lo state React è **in memoria**: se ricarichi la pagina, tutto si azzera.
`localStorage` è **persistente**: sopravvive al ricaricamento.

La strategia è sempre la stessa in due passi:

1. **Al mount** — leggere dal localStorage per inizializzare lo state
2. **Ad ogni cambiamento** — salvare nel localStorage con `useEffect`

```jsx
// Inizializzazione: leggi dal localStorage (valore iniziale dello useState)
const [searchTerm, setSearchTerm] = useState(
  localStorage.getItem("bibliotecaSearch") || ""
);

// Salvataggio: scrivi nel localStorage ogni volta che il valore cambia
useEffect(() => {
  localStorage.setItem("bibliotecaSearch", searchTerm);
}, [searchTerm]);
```

Il `dependency array` `[searchTerm]` dice a React: *"esegui questo effect solo quando searchTerm cambia"*.

#### Task 3 — searchTerm (stringa)

Le stringhe si salvano direttamente, senza JSON:

```jsx
// salvataggio
localStorage.setItem("bibliotecaSearch", searchTerm);

// lettura
localStorage.getItem("bibliotecaSearch") || ""
```

Il `|| ""` gestisce il caso in cui `getItem` ritorna `null` (localStorage vuoto).

#### Task 4 — showOnlyUnread (boolean)

`localStorage` salva solo stringhe. I boolean richiedono la conversione:

```jsx
// salvataggio: boolean → stringa JSON ("true" / "false")
localStorage.setItem("bibliotecaShowUnread", JSON.stringify(showOnlyUnread));

// lettura: stringa JSON → boolean
JSON.parse(localStorage.getItem("bibliotecaShowUnread") || "false")
```

Senza `JSON.parse`, `localStorage.getItem()` restituirebbe la stringa `"false"`, che in JavaScript è **truthy** — il checkbox sarebbe sempre attivo!

#### Task 5 — reviews (array di oggetti)

Gli array richiedono anch'essi la conversione JSON:

```jsx
// salvataggio: array → stringa JSON
localStorage.setItem("bibliotecaReviews", JSON.stringify(reviews));

// lettura: stringa JSON → array (|| "[]" come fallback se localStorage è vuoto)
JSON.parse(localStorage.getItem("bibliotecaReviews") || "[]")
```

Il `nextId` viene calcolato dal massimo `id` presente nelle recensioni salvate, così non si creano duplicati dopo un ricaricamento:

```jsx
const [nextId, setNextId] = useState(() => {
  const saved = JSON.parse(localStorage.getItem("bibliotecaReviews") || "[]");
  return saved.length > 0 ? Math.max(...saved.map((r) => r.id)) + 1 : 1;
});
```

#### Task 6 (Extra) — Cancella Cronologia

Un button che rimuove tutte le chiavi dal localStorage e resetta gli state ai valori di default:

```jsx
const handleClearHistory = () => {
  localStorage.removeItem("bibliotecaSearch");
  localStorage.removeItem("bibliotecaShowUnread");
  localStorage.removeItem("bibliotecaReviews");
  setSearchTerm("");
  setShowOnlyUnread(false);
  setReviews([]);
  setNextId(1);
};
```

---

### Parte C: Organizzazione File

#### Struttura prima di E04

Tutto il codice stava in un unico `App.jsx` (~240 righe).

#### Struttura dopo E04

```
src/
├── App.jsx                  (~130 righe — solo logica e stato)
├── data/
│   └── books.js             (dati statici dei libri)
└── components/
    ├── SearchBar.jsx
    ├── UnreadFilter.jsx
    ├── BookItem.jsx
    ├── BookList.jsx          (importa BookItem con path relativo ./BookItem)
    ├── ReviewForm.jsx
    └── ReviewList.jsx
```

Ogni componente ha il proprio file con `export default`. Le importazioni seguono la convenzione:

```jsx
// In App.jsx — i componenti sono un livello sotto
import BookList from "./components/BookList";

// In BookList.jsx — BookItem è allo stesso livello
import BookItem from "./BookItem";

// In App.jsx — i dati sono in src/data/
import { books as initialBooks } from "./data/books";
```

Il file `books.js` usa `export const` (named export) invece di `export default` perché è un dato, non un componente:

```js
// src/data/books.js
export const books = [ ... ];
```

---

## Chiavi localStorage utilizzate

| Chiave | Tipo | Contenuto |
|---|---|---|
| `bibliotecaSearch` | stringa | termine di ricerca corrente |
| `bibliotecaShowUnread` | stringa JSON | `"true"` / `"false"` |
| `bibliotecaReviews` | stringa JSON | array delle recensioni |

---

## E06 — Rimozione Libri e Componente Notification

### Parte A: Rimozione di un libro (filter e Callback Drilling)

In `App.jsx` è stata creata la funzione `handleRemoveBook(bookId)` che usa `.filter()` per creare un nuovo array escludendo il libro con quell'id:

```jsx
const handleRemoveBook = (bookId) => {
  const removedBook = books.find((book) => book.id === bookId);
  setBooks(books.filter((book) => book.id !== bookId));
};
```

La funzione viene passata come prop `onRemoveBook` attraverso la catena **App → BookList → BookItem** (pattern detto *callback drilling*). In `BookItem` un bottone "Rimuovi" chiama `onRemoveBook(book.id)` tramite un inline handler.

### Parte B: Il componente Notification con auto-dismiss

È stato creato `src/components/Notification.jsx`, un componente riutilizzabile che mostra un alert Bootstrap e scompare automaticamente dopo 3 secondi.

**Props:** `message`, `type` (tipo alert Bootstrap), `onDismiss` (callback).

Il cuore del componente è il `useEffect` con cleanup:

```jsx
useEffect(() => {
  const timerId = setTimeout(() => {
    onDismiss();
  }, 3000);

  return () => {
    clearTimeout(timerId);
  };
}, [onDismiss]);
```

**Perché il cleanup è fondamentale:**
Se il componente viene smontato prima che il timer scada (es. l'utente clicca la X), il timer deve essere cancellato con `clearTimeout`. Senza cleanup, `setTimeout` continuerebbe a contare e chiamerebbe `onDismiss` su un componente che non esiste più, causando un memory leak o un warning di React. Questo è lo stesso concetto della lezione JavaScript L13: `setTimeout` restituisce un timer ID che possiamo passare a `clearTimeout` — qui applicato dentro React tramite useEffect + cleanup.

### Parte C: Collegamento in App.jsx

- Aggiunto lo state `notification` (inizialmente `null`)
- `handleRemoveBook` salva il titolo del libro rimosso prima di filtrarlo, poi imposta la notifica
- Il componente `<Notification>` viene renderizzato condizionalmente con `{notification && <Notification ... />}`

### Flusso completo

1. L'utente clicca "Rimuovi" su un libro
2. `BookItem` chiama `onRemoveBook(book.id)` → risale fino a `handleRemoveBook` in `App`
3. Il libro viene filtrato via con `.filter()` e la notifica viene impostata nello state
4. Appare un alert giallo Bootstrap con il messaggio *"Titolo" rimosso dalla biblioteca*
5. Dopo 3 secondi, l'alert scompare da solo (auto-dismiss via `setTimeout`)
6. In alternativa, l'utente può cliccare la X per chiuderlo prima — il cleanup di `useEffect` cancella il timer con `clearTimeout`
