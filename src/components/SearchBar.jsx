// SearchBar E04: controlled component — riceve value, onSearch
const SearchBar = ({ value, onSearch }) => (
  <>
    <label htmlFor="search">Cerca un libro: </label>
    <input
      id="search"
      type="text"
      placeholder="Inserisci titolo o autore..."
      value={value}
      onChange={(e) => onSearch(e.target.value)}
    />
  </>
);

export default SearchBar;
