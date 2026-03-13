import { useState } from "react";

const AddBookForm = ({ onAddBook, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');
  const [genre, setGenre] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim() || !author.trim() || !pages || !genre.trim()) return;

    onAddBook({ title, author, pages: Number(pages), genre, read: false });

    setTitle('');
    setAuthor('');
    setPages('');
    setGenre('');
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <strong><i className="bi bi-plus-circle me-1"></i>Aggiungi un Libro</strong>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-2">
            <div className="col-md-3">
              <input
                id="add-title"
                type="text"
                className="form-control"
                placeholder="Titolo *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="col-md-3">
              <input
                id="add-author"
                type="text"
                className="form-control"
                placeholder="Autore *"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="col-md-2">
              <input
                id="add-pages"
                type="number"
                className="form-control"
                placeholder="Pagine *"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="col-md-2">
              <input
                id="add-genre"
                type="text"
                className="form-control"
                placeholder="Genere *"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="col-md-2">
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={!title.trim() || !author.trim() || !pages || !genre.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    Invio in corso...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-lg me-1"></i>Aggiungi
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookForm;
