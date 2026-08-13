import { useAtlasStore } from '../stores/atlasStore'
import { chargerFichierPeriode } from '../data/loader'
import BlocSources from './BlocSources'
import TexteEnrichi from './TexteEnrichi'

export default function EvenementModale({ id }) {
  const ereActive = useAtlasStore((s) => s.ereActive)
  const periodeActive = useAtlasStore((s) => s.periodeActive)
  const evenements = chargerFichierPeriode(ereActive, periodeActive, 'evenements') ?? []
  const evenement = evenements.find((e) => e.id === id)

  if (!evenement) return <p className="modale-vide">Événement introuvable.</p>

  return (
    <div>
      <div className="modale-souscription">{evenement.date}</div>
      <h2>{evenement.titre}</h2>
      {evenement.description && (
        <p className="modale-note" style={{ marginTop: '14px' }}>
          <TexteEnrichi texte={evenement.description} />
        </p>
      )}
      <div style={{ marginTop: '14px' }}>
        <BlocSources ids={evenement.sources} />
      </div>
    </div>
  )
}
