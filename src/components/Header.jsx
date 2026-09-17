export default function Header({ title, subtitle }) {
  return (
    <header className="app-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
    </header>
  );
}
