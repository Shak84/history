import { create } from 'zustand'

export const useGameStore = create((set) => ({
  personnageId: null,
  annee: 1643,
  progression: {},
  provinceActive: null,
  modaleStack: [],

  setPersonnageId: (id) => set({ personnageId: id }),
  setAnnee: (annee) => set({ annee }),

  ouvrirModale: (modale) =>
    set((state) => ({ modaleStack: [...state.modaleStack, modale] })),
  fermerModale: () =>
    set((state) => ({ modaleStack: state.modaleStack.slice(0, -1) })),
  revenirA: (index) =>
    set((state) => ({ modaleStack: state.modaleStack.slice(0, index + 1) })),
  fermerToutesLesModales: () => set({ modaleStack: [] }),
}))
