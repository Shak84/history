import { useAtlasStore } from '../stores/atlasStore'
import eres from '../data/eres.json'
import { chargerPeriodes } from '../data/loader'

export default function PeriodesBar() {
  const ereActive = useAtlasStore((s) => s.ereActive)
  const periodeActive = useAtlasStore((s) => s.periodeActive)
  const setPeriode = useAtlasStore((s) => s.setPeriode)

  const ere = eres.find((e) => e.id === ereActive)
  const periodes = chargerPeriodes(ereActive)

  return (
    <div className="periodes-bar">
      <div className="periodes-label">{ere?.nom}</div>
      <div className="periodes">
        {periodes.map((p) => (
          <button
            key={p.id}
            className={`periode ${p.id === periodeActive ? 'actif' : ''}`}
            onClick={() => setPeriode(p.id)}
          >
            <span className="annees">{p.annees}</span>
            <span className="nom">{p.nom}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
