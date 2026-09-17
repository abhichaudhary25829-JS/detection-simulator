import { FlaskConical } from 'lucide-react';

export default function SampleCaseSelector({ cases, onLoad }) {
  const handleSelect = (e) => {
    const selected = cases.find((c) => c.id === e.target.value);
    if (selected) onLoad(selected);
    e.target.value = '';
  };

  return (
    <div className="sample-case-selector">
      <FlaskConical size={16} />
      <select defaultValue="" onChange={handleSelect}>
        <option value="" disabled>
          Load Sample Case...
        </option>
        {cases.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
