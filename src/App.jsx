import { useState } from 'react'
import personnages from './data/personnages.json'
import evenements from './data/evenements.json'
import SelecteurPersonnage from './components/SelecteurPersonnage'
import FichePersonnage from './components/FichePersonnage'
import ListeEvenements from './components/ListeEvenements'
import ModaleStack from './components/ModaleStack'

function App() {
  const [personnageId, setPersonnageId] = useState(null)
  const personnage = personnages.find((p) => p.id === personnageId)

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <h1 className="text-3xl font-serif text-stone-800 text-center mb-2">
        Sous le Roi-Soleil
      </h1>
      <p className="text-center text-stone-500 mb-8">
        Le règne de Louis XIV, vécu depuis une place dans la société
      </p>

      {!personnage ? (
        <SelecteurPersonnage personnages={personnages} onChoisir={setPersonnageId} />
      ) : (
        <>
          <FichePersonnage personnage={personnage} onChanger={() => setPersonnageId(null)} />
          <ListeEvenements evenements={evenements} personnageId={personnage.id} />
        </>
      )}
      <ModaleStack />
    </div>
  )
}

export default App
