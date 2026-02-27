// InputWithLabel: componente generico label + input con children
const InputWithLabel = ({ id, value, onInputChange, type = 'text', children }) => {

    const handleChange = (e) =>{
        //chiamo la prop onInputChange che mi viene passata come callback
        onInputChange(e.target.value);
    }

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{children} </label>
      <input
        id={id}
        type={type}
        className="form-control"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default InputWithLabel;
