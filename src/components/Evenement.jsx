import { useState } from 'react'
import sources from '../data/sources.json'
import Decision from './Decision'

const sourcesParId = Object.fromEntries(sources.map((s) => [s.id, s]))

function BlocSources({ ids }) {
  const [ouvert, setOuvert] = useState(false)
  return (
    <div className="mt-3 text-sm">
      <button
        onClick={() => setOuvert((o) => !o)}
        className="text-stone-500 hover:text-stone-800 underline"
      >
        Sources {ouvert ? '▲' : '▼'}
      </button>
      {ouvert && (
        <ul className="mt-2 space-y-1 text-stone-600 list-disc list-inside">
          {ids.map((id) => {
            const s = sourcesParId[id]
            if (!s) return null
            return (
              <li key={id}>
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    {s.reference}
                  </a>
                ) : (
                  s.reference
                )}
                {s.page ? `, p. ${s.page}` : ''}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function Evenement({ evenement, personnageId }) {
  const scene = evenement.vecu?.[personnageId]

  return (
    <div className="border border-stone-300 rounded-lg p-6 max-w-2xl mx-auto text-left">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs uppercase tracking-wide text-stone-400">
          {evenement.date}
        </span>
        {evenement.statut === 'a_verifier' && (
          <span className="text-xs text-amber-600 border border-amber-300 bg-amber-50 rounded px-2 py-0.5">
            sources à vérifier
          </span>
        )}
      </div>
      <h2 className="text-xl font-semibold text-stone-800 mb-3">{evenement.titre}</h2>

      <p className="text-stone-700 mb-4">{evenement.resume}</p>

      {scene && (
        <div className="border-l-2 border-stone-300 pl-4 mb-2">
          <div className="text-xs text-stone-400 italic mb-1">scène reconstituée</div>
          <p className="text-stone-600 italic">{scene.texte}</p>
          {scene.decision && (
            <Decision key={`${evenement.id}-${personnageId}`} decision={scene.decision} />
          )}
        </div>
      )}

      <BlocSources ids={evenement.sources} />
    </div>
  )
}
