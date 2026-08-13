import { useAtlasStore } from '../stores/atlasStore'
import { chargerFichierPeriode } from '../data/loader'
import sources from '../data/sources.json'
import BlocSources from './BlocSources'
import TexteEnrichi from './TexteEnrichi'

const sourcesParId = Object.fromEntries(sources.map((s) => [s.id, s]))

export default function EvenementModale({ id }) {
  const ereActive = useAtlasStore((s) => s.ereActive)
  const periodeActive = useAtlasStore((s) => s.periodeActive)
  const evenements = chargerFichierPeriode(ereActive, periodeActive, 'evenements') ?? []
  const evenement = evenements.find((e) => e.id === id)

  if (!evenement) return <p className="modale-vide">Événement introuvable.</p>

  return (
    <div>
      <div className="modale-souscription">
        {evenement.date}
        {evenement.statut === 'a_verifier' && ' · sources à vérifier'}
      </div>
      <h2>{evenement.titre}</h2>
      {(evenement.corps ?? []).map((p, i) => (
        <p key={i} className="modale-note" style={{ marginTop: i === 0 ? '14px' : '8px', fontStyle: 'normal' }}>
          <TexteEnrichi texte={p} />
        </p>
      ))}
      {(evenement.citations ?? []).map((c, i) => (
        <div key={i} className="citation">
          « {c.texte} »
          <cite>
            {sourcesParId[c.source]?.reference ?? c.source}
            {c.page ? `, p. ${c.page}` : ''}
          </cite>
        </div>
      ))}
      <div style={{ marginTop: '14px' }}>
        <BlocSources ids={evenement.sources} />
      </div>
    </div>
  )
}
