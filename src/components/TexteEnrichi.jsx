import { useGameStore } from '../stores/gameStore'
import figures from '../data/figures.json'
import evenements from '../data/evenements.json'

const LIEN_REGEX = /\[\[(figure|evenement):([a-z0-9-]+)\]\]/g

const labelsParType = {
  figure: (id) => figures.find((f) => f.id === id)?.nom ?? id,
  evenement: (id) => evenements.find((e) => e.id === id)?.titre ?? id,
}

export default function TexteEnrichi({ texte }) {
  const ouvrirModale = useGameStore((s) => s.ouvrirModale)

  const parties = []
  let dernierIndex = 0
  let match
  LIEN_REGEX.lastIndex = 0

  while ((match = LIEN_REGEX.exec(texte)) !== null) {
    const [complet, type, id] = match
    if (match.index > dernierIndex) {
      parties.push(texte.slice(dernierIndex, match.index))
    }
    parties.push(
      <button
        key={`${type}-${id}-${match.index}`}
        onClick={() => ouvrirModale({ type, id })}
        className="text-blue-700 hover:underline font-medium"
      >
        {labelsParType[type](id)}
      </button>
    )
    dernierIndex = match.index + complet.length
  }
  if (dernierIndex < texte.length) {
    parties.push(texte.slice(dernierIndex))
  }

  return <>{parties}</>
}
