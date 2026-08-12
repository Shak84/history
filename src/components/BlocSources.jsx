import { useState } from 'react'
import sources from '../data/sources.json'

const sourcesParId = Object.fromEntries(sources.map((s) => [s.id, s]))

export default function BlocSources({ ids }) {
  const [ouvert, setOuvert] = useState(false)
  if (!ids || ids.length === 0) return null

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
