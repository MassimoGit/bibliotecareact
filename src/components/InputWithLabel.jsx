// InputWithLabel: componente generico label + input con children
const InputWithLabel = ({ id, value, onInputChange, type = 'text', children }) => (
  <>
    <label htmlFor={id}>{children} </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onInputChange(e.target.value)}
    />
  </>
);

export default InputWithLabel;
