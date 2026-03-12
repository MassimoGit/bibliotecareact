import { useState } from "react";

const AddBookForm = ({ onAddBook }) => {
  const [nuovoLibro, setNuovoLibro] = useState({
    title: '',
    author: '',
    pages: '',
    genre: ''
  });

  const handleNuovoLibroChange = (event) => {
    const { name, value } = event.target;
    setNuovoLibro({
      ...nuovoLibro,
      [name]: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!nuovoLibro.title.trim() || !nuovoLibro.author.trim()) {
      return;
    }
    const libroCompleto = {
      id: Date.now(),
      title: nuovoLibro.title.trim(),
      author: nuovoLibro.author.trim(),
      pages: Number(nuovoLibro.pages),
      genre: nuovoLibro.genre,
      read: false
    };
    onAddBook(libroCompleto);
    setNuovoLibro({
      title: '',
      author: '',
      pages: '',
      genre: ''
    });
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
                type="text"
                className="form-control"
                placeholder="Titolo *"
                name="title"
                value={nuovoLibro.title}
                onChange={handleNuovoLibroChange}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Autore *"
                name="author"
                value={nuovoLibro.author}
                onChange={handleNuovoLibroChange}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Pagine"
                name="pages"
                value={nuovoLibro.pages}
                onChange={handleNuovoLibroChange}
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Genere"
                name="genre"
                value={nuovoLibro.genre}
                onChange={handleNuovoLibroChange}
              />
            </div>
            <div className="col-md-2">
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={!nuovoLibro.title.trim() || !nuovoLibro.author.trim()}
              >
                <i className="bi bi-plus-lg me-1"></i>Aggiungi
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookForm;
