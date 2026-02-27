// Checkbox E04 "Solo non letti"
const UnreadFilter = ({ checked, onChange }) => (
  <label>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />{" "}
    Mostra solo libri da leggere
  </label>
);

export default UnreadFilter;
