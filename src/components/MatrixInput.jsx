// MatrixInput.jsx
// A reusable editable table for entering a Process x Resource matrix
// (Allocation, Maximum, Request, etc).

export default function MatrixInput({ title, matrix, onChange, resourceLabels, readOnly = false }) {
  const handleCellChange = (rowIdx, colIdx, value) => {
    const updated = matrix.map((row) => [...row]);
    updated[rowIdx][colIdx] = value;
    onChange(updated);
  };

  return (
    <div className="matrix-block">
      {title && <h4 className="matrix-title">{title}</h4>}
      <div className="table-scroll">
        <table className="matrix-table">
          <thead>
            <tr>
              <th>Process</th>
              {resourceLabels.map((label) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="process-label">P{i}</td>
                {row.map((val, j) => (
                  <td key={j}>
                    <input
                      type="number"
                      min="0"
                      className="matrix-cell-input"
                      value={val}
                      readOnly={readOnly}
                      onChange={(e) => handleCellChange(i, j, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
