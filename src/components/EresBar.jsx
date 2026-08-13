import { useAtlasStore } from '../stores/atlasStore'
import eres from '../data/eres.json'
import BarreRecherche from './BarreRecherche'

export default function EresBar() {
  const ereActive = useAtlasStore((s) => s.ereActive)
  const setEre = useAtlasStore((s) => s.setEre)

  return (
    <div className="eres-bar">
      <div className="brand">
        <span className="fleur">⚜ ⚜ ⚜</span>
        <h1>Atlas de France</h1>
        <span className="sub">Histoire du royaume à la République</span>
      </div>
      <div className="eres">
        {eres.map((ere) => (
          <button
            key={ere.id}
            className={`ere ${ere.id === ereActive ? 'actif' : ''} ${!ere.disponible ? 'indispo' : ''}`}
            onClick={() => ere.disponible && setEre(ere.id)}
          >
            <span className="siecle">{ere.siecle}</span>
            <span className="nom">{ere.nom}</span>
          </button>
        ))}
      </div>
      <BarreRecherche />
    </div>
  )
}
