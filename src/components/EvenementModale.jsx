import evenements from '../data/evenements.json'
import BlocSources from './BlocSources'
import TexteEnrichi from './TexteEnrichi'

export default function EvenementModale({ id }) {
  const evenement = evenements.find((e) => e.id === id)
  if (!evenement) return <p className="text-stone-500">Événement introuvable.</p>

  return (
    <div className="text-left">
      <span className="text-xs uppercase tracking-wide text-stone-400">{evenement.date}</span>
      <h2 className="text-xl font-semibold text-stone-800 mb-3">{evenement.titre}</h2>
      <p className="text-stone-700">
        <TexteEnrichi texte={evenement.resume} />
      </p>
      <BlocSources ids={evenement.sources} />
    </div>
  )
}
