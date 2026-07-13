import { create } from 'zustand'

export interface UIState {
  sidebarOpen: boolean
  rightPanelOpen: boolean
  setSidebarOpen: (open: boolean) => void
  setRightPanelOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  rightPanelOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
}))
