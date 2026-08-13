import { create } from 'zustand'

export const useAtlasStore = create((set) => ({
  ereActive: 'ancien-regime',
  periodeActive: 'louis-xiv',
  themeActif: 'politique',
  evenementActif: null,
  modaleStack: [],
  anneeCarte: 1661,

  setEre: (id) => set({ ereActive: id }),
  setPeriode: (id) => set({ periodeActive: id, evenementActif: null }),
  setTheme: (id) => set({ themeActif: id }),
  setEvenementActif: (id) => set({ evenementActif: id }),
  setAnneeCarte: (annee) => set({ anneeCarte: annee }),
}))
