import { create } from 'zustand'

export interface CanvasState {
  zoom: number
  pan: { x: number; y: number }
  setZoom: (zoom: number) => void
  setPan: (pan: { x: number; y: number }) => void
}

export const useCanvasStore = create<CanvasState>((set) => ({
  zoom: 1,
  pan: { x: 0, y: 0 },
  setZoom: (zoom) => set({ zoom }),
  setPan: (pan) => set({ pan }),
}))
