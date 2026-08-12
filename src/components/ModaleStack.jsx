import { useEffect } from 'react'
import { useGameStore } from '../stores/gameStore'
import Modale from './Modale'
import figures from '../data/figures.json'
import evenements from '../data/evenements.json'

const labelsParType = {
  figure: (id) => figures.find((f) => f.id === id)?.nom ?? id,
  evenement: (id) => evenements.find((e) => e.id === id)?.titre ?? id,
}

export default function ModaleStack() {
  const modaleStack = useGameStore((s) => s.modaleStack)
  const fermerModale = useGameStore((s) => s.fermerModale)
  const revenirA = useGameStore((s) => s.revenirA)

  useEffect(() => {
    if (modaleStack.length === 0) return
    const surEchap = (e) => {
      if (e.key === 'Escape') fermerModale()
    }
    window.addEventListener('keydown', surEchap)
    return () => window.removeEventListener('keydown', surEchap)
  }, [modaleStack.length, fermerModale])

  if (modaleStack.length === 0) return null

  const modaleActive = modaleStack[modaleStack.length - 1]
  const breadcrumb = modaleStack.map((m) => labelsParType[m.type](m.id))

  return (
    <Modale
      modale={modaleActive}
      index={modaleStack.length - 1}
      breadcrumb={breadcrumb}
      onFermer={fermerModale}
      onRevenirA={revenirA}
    />
  )
}
