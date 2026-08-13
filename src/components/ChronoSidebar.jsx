import { useAtlasStore } from '../stores/atlasStore'
import { chargerFichierPeriode, chargerPeriodes } from '../data/loader'

export default function ChronoSidebar() {
  const ereActive = useAtlasStore((s) => s.ereActive)
  const periodeActive = useAtlasStore((s) => s.periodeActive)
  const evenementActif = useAtlasStore((s) => s.evenementActif)
  const setEvenementActif = useAtlasStore((s) => s.setEvenementActif)
  const ouvrirModale = useAtlasStore((s) => s.ouvrirModale)

  const periode = chargerPeriodes(ereActive).find((p) => p.id === periodeActive)
  const evenements = chargerFichierPeriode(ereActive, periodeActive, 'evenements') ?? []

  return (
    <aside className="chrono">
      <div className="chrono-titre">Chronologie</div>
      <div className="chrono-sub">{periode ? `${periode.nom} · ${periode.annees}` : periodeActive}</div>
      {evenements.length === 0 ? (
        <div className="chrono-vide">Chronologie à compléter</div>
      ) : (
        evenements.map((e) => (
          <div
            key={e.id}
            className={`evt ${e.majeur ? '' : 'mineur'} ${e.id === evenementActif ? 'actif' : ''}`}
            onClick={() => {
              setEvenementActif(e.id)
              ouvrirModale({ type: 'evenement', id: e.id })
            }}
          >
            <div className="an">{e.date.slice(0, 4)}</div>
            <div className="titre">{e.titre}</div>
          </div>
        ))
      )}
    </aside>
  )
}
