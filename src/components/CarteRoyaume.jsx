import { useMemo } from 'react'
import { geoConicConformal, geoPath } from 'd3-geo'
import { useAtlasStore } from '../stores/atlasStore'
import royaumeGeoBrut from '../data/geo/royaume-france.geojson?raw'
import BlocSources from './BlocSources'

const royaumeGeo = JSON.parse(royaumeGeoBrut)
const ANNEES_DISPONIBLES = royaumeGeo.features.map((f) => f.properties.annee).sort((a, b) => a - b)

const LARGEUR = 560
const HAUTEUR = 520

export default function CarteRoyaume() {
  const anneeCarte = useAtlasStore((s) => s.anneeCarte)
  const setAnneeCarte = useAtlasStore((s) => s.setAnneeCarte)

  const anneeProche = ANNEES_DISPONIBLES.reduce((meilleure, a) =>
    Math.abs(a - anneeCarte) < Math.abs(meilleure - anneeCarte) ? a : meilleure
  )
  const feature = royaumeGeo.features.find((f) => f.properties.annee === anneeProche)

  const chemin = useMemo(() => {
    const projection = geoConicConformal()
      .parallels([44, 49])
      .rotate([-3, 0])
      .fitSize([LARGEUR, HAUTEUR], feature)
    return geoPath(projection)(feature.geometry)
  }, [feature])

  return (
    <div className="carte-conteneur">
      <div className="carte-selecteur-annee">
        {ANNEES_DISPONIBLES.map((a) => (
          <button
            key={a}
            className={a === anneeProche ? 'actif' : ''}
            onClick={() => setAnneeCarte(a)}
          >
            {a}
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`} className="carte-svg">
        <path d={chemin} className="carte-royaume" />
      </svg>
      <p className="carte-legende">
        Frontières du royaume de France en {anneeProche}. Ce tracé représente le royaume dans son
        ensemble ; le découpage en provinces (généralités, gouvernements) n'a pas pu être
        sourcé avec des frontières vérifiées et n'est donc pas encore représenté.
      </p>
      <BlocSources ids={['historical-basemaps']} />
    </div>
  )
}
