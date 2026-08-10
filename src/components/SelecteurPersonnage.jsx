export default function SelecteurPersonnage({ personnages, onChoisir }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
      {personnages.map((p) => (
        <button
          key={p.id}
          onClick={() => onChoisir(p.id)}
          className="text-left border border-stone-300 rounded-lg p-4 hover:border-stone-500 hover:bg-stone-50 transition-colors"
        >
          <div className="text-3xl mb-2">{p.avatar}</div>
          <div className="font-semibold text-stone-800">{p.nom}</div>
          <div className="text-sm text-stone-500 mt-1">{p.couche_sociale}</div>
        </button>
      ))}
    </div>
  )
}
