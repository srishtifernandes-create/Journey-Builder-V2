import { create } from 'zustand'

export interface Node {
  id: string
  type: string
  position: { x: number; y: number }
  config: Record<string, any>
  rules?: Record<string, any>
}

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
  nodes: Node[]
  edges: Edge[]
  metadata: JourneyMetadata | null
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  setMetadata: (metadata: JourneyMetadata) => void
}

export const useJourneyStore = create<JourneyState>((set) => ({
  nodes: [],
  edges: [],
  metadata: null,
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setMetadata: (metadata) => set({ metadata }),
}))
