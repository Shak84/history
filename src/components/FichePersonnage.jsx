export default function FichePersonnage({ personnage, onChanger }) {
  return (
    <div className="flex items-center justify-between border border-stone-300 rounded-lg p-4 max-w-2xl mx-auto mb-8">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{personnage.avatar}</span>
        <div className="text-left">
          <div className="font-semibold text-stone-800">{personnage.nom}</div>
          <div className="text-sm text-stone-500">{personnage.description}</div>
        </div>
      </div>
      <button
        onClick={onChanger}
        className="text-sm text-stone-500 hover:text-stone-800 underline shrink-0 ml-4"
      >
        Changer
      </button>
    </div>
  )
}
