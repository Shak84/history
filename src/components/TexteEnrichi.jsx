import { useAtlasStore } from '../stores/atlasStore'
import { chargerFichierPeriode } from '../data/loader'

const LIEN_REGEX = /\[\[(figure|evenement|province):([a-z0-9-]+)\]\]/g

export default function TexteEnrichi({ texte }) {
  const ereActive = useAtlasStore((s) => s.ereActive)
  const periodeActive = useAtlasStore((s) => s.periodeActive)
  const ouvrirModale = useAtlasStore((s) => s.ouvrirModale)

  const figures = chargerFichierPeriode(ereActive, periodeActive, 'figures') ?? []
  const evenements = chargerFichierPeriode(ereActive, periodeActive, 'evenements') ?? []
  const provinces = chargerFichierPeriode(ereActive, periodeActive, 'provinces') ?? []

  const labelsParType = {
    figure: (id) => figures.find((f) => f.id === id)?.nom ?? id,
    evenement: (id) => evenements.find((e) => e.id === id)?.titre ?? id,
    province: (id) => provinces.find((p) => p.id === id)?.nom ?? id,
  }

  const parties = []
  let dernierIndex = 0
  let match
  LIEN_REGEX.lastIndex = 0
  while ((match = LIEN_REGEX.exec(texte)) !== null) {
    const [complet, type, id] = match
    if (match.index > dernierIndex) parties.push(texte.slice(dernierIndex, match.index))
    parties.push(
      <span
        key={`${type}-${id}-${match.index}`}
        className="personne"
        onClick={() => ouvrirModale({ type, id })}
      >
        {labelsParType[type](id)}
      </span>
    )
    dernierIndex = match.index + complet.length
  }
  if (dernierIndex < texte.length) parties.push(texte.slice(dernierIndex))

  return <>{parties}</>
}
