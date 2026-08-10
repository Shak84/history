import { useState } from 'react'

export default function Decision({ decision }) {
  const [choix, setChoix] = useState(null)

  return (
    <div className="mt-4 border-t border-stone-200 pt-4">
      <div className="text-sm font-medium text-stone-700 mb-2">{decision.question}</div>
      <div className="flex flex-col gap-2">
        {decision.options.map((option, i) => (
          <button
            key={i}
            onClick={() => setChoix(i)}
            className={`text-left text-sm border rounded px-3 py-2 transition-colors ${
              choix === i
                ? 'border-stone-500 bg-stone-100'
                : 'border-stone-300 hover:border-stone-400'
            }`}
          >
            {option.texte}
          </button>
        ))}
      </div>
      {choix !== null && (
        <p className="text-sm text-stone-600 italic mt-3">
          {decision.options[choix].consequence}
        </p>
      )}
    </div>
  )
}
