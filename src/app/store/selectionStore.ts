import { create } from 'zustand'

export interface SelectionState {
  selectedNodeId: string | null
  selectedEdgeId: string | null
  setSelectedNodeId: (nodeId: string | null) => void
  setSelectedEdgeId: (edgeId: string | null) => void
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedNodeId: null,
  selectedEdgeId: null,
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
  setSelectedEdgeId: (edgeId) => set({ selectedEdgeId: edgeId }),
}))
