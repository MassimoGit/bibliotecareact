// Checkbox E04 "Solo non letti"
const UnreadFilter = ({ checked, onChange }) => {
  const handleChange = (e) => {
    // chiamo la prop onChange che mi viene passata come callback
    onChange(e.target.checked);
  };

  return (
    <div className="form-check mb-3">
      <input
        className="form-check-input"
        type="checkbox"
        id="unreadFilter"
        checked={checked}
        onChange={handleChange}
      />
      <label className="form-check-label" htmlFor="unreadFilter">
        Mostra solo libri da leggere
      </label>
    </div>
  );
};

export default UnreadFilter;
