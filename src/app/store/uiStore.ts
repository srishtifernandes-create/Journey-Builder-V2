import { create } from 'zustand'

export interface UIState {
  sidebarCollapsed: boolean
  activeInspectorTab: 'config' | 'rules' | 'history'
  theme: string
  setSidebarCollapsed: (collapsed: boolean) => void
  setActiveInspectorTab: (tab: 'config' | 'rules' | 'history') => void
  setTheme: (theme: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  activeInspectorTab: 'config',
  theme: 'light',
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
  setTheme: (theme) => set({ theme }),
}))
