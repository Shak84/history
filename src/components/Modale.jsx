export default function Modale({ enfant, breadcrumb, onFermer, onRevenirA }) {
  return (
    <div className="modale-overlay" onClick={onFermer}>
      <div className="modale-box" onClick={(e) => e.stopPropagation()}>
        {breadcrumb.length > 0 && (
          <nav className="modale-fil">
            {breadcrumb.map((crumb, i) => (
              <span key={i}>
                <button onClick={() => onRevenirA(i)}>{crumb}</button>
                {i < breadcrumb.length - 1 && ' › '}
              </span>
            ))}
          </nav>
        )}
        <button className="modale-close" onClick={onFermer} aria-label="Fermer">
          ✕
        </button>
        {enfant}
      </div>
    </div>
  )
}
