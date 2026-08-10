import { useState } from 'react'
import Evenement from './Evenement'

export default function ListeEvenements({ evenements, personnageId }) {
  const [index, setIndex] = useState(0)
  const evenement = evenements[index]

  return (
    <div>
      <Evenement evenement={evenement} personnageId={personnageId} />

      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="px-3 py-1 border border-stone-300 rounded disabled:opacity-30 hover:bg-stone-50"
        >
          ← Précédent
        </button>
        <span className="text-sm text-stone-500">
          {index + 1} / {evenements.length}
        </span>
        <button
          onClick={() => setIndex((i) => Math.min(evenements.length - 1, i + 1))}
          disabled={index === evenements.length - 1}
          className="px-3 py-1 border border-stone-300 rounded disabled:opacity-30 hover:bg-stone-50"
        >
          Suivant →
        </button>
      </div>
    </div>
  )
}
