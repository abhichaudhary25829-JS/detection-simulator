export default function Card({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={`app-card ${className}`}>
      {(title || Icon) && (
        <div className="app-card-header">
          {Icon && <Icon size={18} />}
          {title && <h3>{title}</h3>}
        </div>
      )}
      <div className="app-card-body">{children}</div>
    </div>
  );
}
