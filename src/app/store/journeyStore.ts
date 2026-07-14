import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { INode } from '../../features/nodes/contracts/INode'

export interface Edge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

export interface JourneyMetadata {
  id: string
  name: string
  version: number
  status: 'draft' | 'published' | 'archived'
}

export interface JourneyState {
  nodes: INode[]
  edges: Edge[]
  metadata: JourneyMetadata | null
  setNodes: (nodes: INode[]) => void
  addNode: (node: INode) => void
  setEdges: (edges: Edge[]) => void
  setMetadata: (metadata: JourneyMetadata) => void
  updateNodeConfig: (nodeId: string, configUpdates: any) => void
}

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set) => ({
      nodes: [],
      edges: [],
      metadata: null,
      setNodes: (nodes) => set({ nodes }),
      addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),
      setEdges: (edges) => set({ edges }),
      setMetadata: (metadata) => set({ metadata }),
      updateNodeConfig: (nodeId, configUpdates) =>
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.id === nodeId ? { ...n, config: { ...n.config, ...configUpdates } } : n
          ),
        })),
    }),
    {
      name: 'jb-journey-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges, metadata: state.metadata }),
    }
  )
)
