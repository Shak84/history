import { useEffect } from 'react'
import { useAtlasStore } from '../stores/atlasStore'
import Modale from './Modale'
import FigureModale from './FigureModale'
import EvenementModale from './EvenementModale'
import { chargerFichierPeriode } from '../data/loader'

const CONTENUS = { figure: FigureModale, evenement: EvenementModale }

export default function ModaleStack() {
  const modaleStack = useAtlasStore((s) => s.modaleStack)
  const fermerModale = useAtlasStore((s) => s.fermerModale)
  const revenirA = useAtlasStore((s) => s.revenirA)
  const ereActive = useAtlasStore((s) => s.ereActive)
  const periodeActive = useAtlasStore((s) => s.periodeActive)

  useEffect(() => {
    if (modaleStack.length === 0) return
    const surEchap = (e) => {
      if (e.key === 'Escape') fermerModale()
    }
    window.addEventListener('keydown', surEchap)
    return () => window.removeEventListener('keydown', surEchap)
  }, [modaleStack.length, fermerModale])

  if (modaleStack.length === 0) return null

  const figures = chargerFichierPeriode(ereActive, periodeActive, 'figures') ?? []
  const evenements = chargerFichierPeriode(ereActive, periodeActive, 'evenements') ?? []
  const labelsParType = {
    figure: (id) => figures.find((f) => f.id === id)?.nom ?? id,
    evenement: (id) => evenements.find((e) => e.id === id)?.titre ?? id,
  }

  const modaleActive = modaleStack[modaleStack.length - 1]
  const breadcrumb = modaleStack.map((m) => labelsParType[m.type]?.(m.id) ?? m.id)
  const Contenu = CONTENUS[modaleActive.type]

  return (
    <Modale
      breadcrumb={breadcrumb}
      onFermer={fermerModale}
      onRevenirA={revenirA}
      enfant={Contenu ? <Contenu id={modaleActive.id} /> : null}
    />
  )
}
