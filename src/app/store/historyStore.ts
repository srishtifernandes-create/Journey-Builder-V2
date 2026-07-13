import { create } from 'zustand'

export interface HistoryItem {
  id: string
  action: string
  timestamp: string
}

export interface HistoryState {
  past: HistoryItem[]
  future: HistoryItem[]
  pushState: (item: HistoryItem) => void
  undo: () => void
  redo: () => void
}

export const useHistoryStore = create<HistoryState>((set) => ({
  past: [],
  future: [],
  pushState: (item) =>
    set((state) => ({
      past: [...state.past, item],
      future: [],
    })),
  undo: () =>
    set((state) => {
      if (state.past.length === 0) return {}
      const previous = state.past[state.past.length - 1]
      const newPast = state.past.slice(0, state.past.length - 1)
      return {
        past: newPast,
        future: [previous, ...state.future],
      }
    }),
  redo: () =>
    set((state) => {
      if (state.future.length === 0) return {}
      const next = state.future[0]
      const newFuture = state.future.slice(1)
      return {
        past: [...state.past, next],
        future: newFuture,
      }
    }),
}))
