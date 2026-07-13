import { create } from 'zustand'

export interface SelectionState {
  selectedNodeId: string | null
  selectedEdgeId: string | null
  setSelectedNodeId: (nodeId: string | null) => void
  setSelectedEdgeId: (edgeId: string | null) => void
  selectNode: (nodeId: string | null) => void
  clearSelection: () => void
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedNodeId: null,
  selectedEdgeId: null,
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
  setSelectedEdgeId: (edgeId) => set({ selectedEdgeId: edgeId }),
  // Selecting a node clears any selected edge, and vice versa is expected
  // once edge selection is wired up — a node and an edge should never be
  // simultaneously "selected" from the application's point of view.
  selectNode: (nodeId) => set({ selectedNodeId: nodeId, selectedEdgeId: null }),
  clearSelection: () => set({ selectedNodeId: null, selectedEdgeId: null }),
}))
