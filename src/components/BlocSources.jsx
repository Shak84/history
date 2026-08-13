import { useState } from 'react'
import sources from '../data/sources.json'

const sourcesParId = Object.fromEntries(sources.map((s) => [s.id, s]))

export default function BlocSources({ ids }) {
  const [ouvert, setOuvert] = useState(false)
  if (!ids || ids.length === 0) return null

  return (
    <>
      <span className="sources-toggle" onClick={() => setOuvert((o) => !o)}>
        ◈ {ouvert ? 'Masquer les sources' : 'Voir les sources'}
      </span>
      {ouvert && (
        <ul className="sources-liste">
          {ids.map((id) => {
            const s = sourcesParId[id]
            if (!s) return null
            return (
              <li key={id}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noreferrer">
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
    </>
  )
}
