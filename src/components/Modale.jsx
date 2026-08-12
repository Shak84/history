import FigureModale from './FigureModale'
import EvenementModale from './EvenementModale'

const contenusParType = {
  figure: FigureModale,
  evenement: EvenementModale,
}

export default function Modale({ modale, index, breadcrumb, onFermer, onRevenirA }) {
  const Contenu = contenusParType[modale.type]

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      style={{ zIndex: 50 + index }}
      onClick={onFermer}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {breadcrumb.length > 0 && (
          <nav className="text-xs text-stone-400 mb-3 flex flex-wrap gap-1">
            {breadcrumb.map((crumb, i) => (
              <span key={i}>
                <button onClick={() => onRevenirA(i)} className="hover:underline hover:text-stone-600">
                  {crumb}
                </button>
                {i < breadcrumb.length - 1 && ' › '}
              </span>
            ))}
          </nav>
        )}
        <button
          onClick={onFermer}
          aria-label="Fermer"
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 text-lg leading-none"
        >
          ✕
        </button>
        {Contenu ? <Contenu id={modale.id} /> : null}
      </div>
    </div>
  )
}
