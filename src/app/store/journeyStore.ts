import { create } from 'zustand'
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
}

export const useJourneyStore = create<JourneyState>((set) => ({
  nodes: [],
  edges: [],
  metadata: null,
  setNodes: (nodes) => set({ nodes }),
  addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),
  setEdges: (edges) => set({ edges }),
  setMetadata: (metadata) => set({ metadata }),
}))
