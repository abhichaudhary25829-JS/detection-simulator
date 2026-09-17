// VectorInput.jsx
// A reusable editable row of inputs for a resource vector
// (e.g. Available, Work).

export default function VectorInput({ title, vector, onChange, resourceLabels, readOnly = false }) {
  const handleChange = (idx, value) => {
    const updated = [...vector];
    updated[idx] = value;
    onChange(updated);
  };

  return (
    <div className="vector-block">
      {title && <h4 className="matrix-title">{title}</h4>}
      <div className="vector-row">
        {vector.map((val, idx) => (
          <div key={idx} className="vector-cell">
            <label>{resourceLabels[idx]}</label>
            <input
              type="number"
              min="0"
              className="matrix-cell-input"
              value={val}
              readOnly={readOnly}
              onChange={(e) => handleChange(idx, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
