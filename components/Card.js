export default function Card({ title, children, className = "", ...props }) {
  return (
    <div className={`card glass-panel ${className}`} {...props}>
      {title && <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>}
      <div className="card-content">
        {children}
      </div>

      <style jsx>{`
        .card {
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: var(--transition-smooth);
        }

        .card-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .card-content {
          padding: 1.5rem;
          flex: 1;
        }
      `}</style>
    </div>
  );
}
