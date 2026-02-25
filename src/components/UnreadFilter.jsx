// Checkbox "Solo non letti"
const UnreadFilter = ({ checked, onChange }) => (
  <div>
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />{" "}
      Mostra solo libri da leggere
    </label>
  </div>
);

export default UnreadFilter;
