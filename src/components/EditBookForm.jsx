import { useState } from 'react';

const EditBookForm = ({ book, onSave, onCancel }) => {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [pages, setPages] = useState(book.pages);
  const [genre, setGenre] = useState(book.genre);
  const [read, setRead] = useState(book.read);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim() || !author.trim() || !pages || !genre.trim()) return;

    onSave({ title, author, pages: Number(pages), genre, read });
  };

  return (
    <form onSubmit={handleSubmit} className="card mb-3 border-warning">
      <div className="card-header bg-warning bg-opacity-25">
        <strong><i className="bi bi-pencil me-1"></i>Modifica Libro</strong>
      </div>
      <div className="card-body">
        <div className="row g-2 mb-2">
          <div className="col-md-3">
            <label htmlFor="edit-title" className="form-label form-label-sm">Titolo</label>
            <input
              id="edit-title"
              type="text"
              className="form-control form-control-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="edit-author" className="form-label form-label-sm">Autore</label>
            <input
              id="edit-author"
              type="text"
              className="form-control form-control-sm"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="edit-pages" className="form-label form-label-sm">Pagine</label>
            <input
              id="edit-pages"
              type="number"
              className="form-control form-control-sm"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="edit-genre" className="form-label form-label-sm">Genere</label>
            <input
              id="edit-genre"
              type="text"
              className="form-control form-control-sm"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label form-label-sm">&nbsp;</label>
            <div className="form-check">
              <input
                id="edit-read"
                type="checkbox"
                className="form-check-input"
                checked={read}
                onChange={(e) => setRead(e.target.checked)}
              />
              <label htmlFor="edit-read" className="form-check-label">Letto</label>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-warning btn-sm me-2">
          <i className="bi bi-check-lg me-1"></i>Salva
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
          <i className="bi bi-x-lg me-1"></i>Annulla
        </button>
      </div>
    </form>
  );
};

export default EditBookForm;
