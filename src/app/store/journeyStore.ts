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
  addEdge: (edge: Edge) => void
  deleteNode: (nodeId: string) => void
  duplicateNode: (nodeId: string) => void
  reorderNodes: (startIndex: number, endIndex: number) => void
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
      addEdge: (edge) => set((s) => ({ edges: [...s.edges, edge] })),
      deleteNode: (nodeId) => set((s) => ({
        nodes: s.nodes.filter((n) => n.id !== nodeId),
        edges: s.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      })),
      duplicateNode: (nodeId) => set((s) => {
        const sourceNode = s.nodes.find((n) => n.id === nodeId)
        if (!sourceNode) return {}
        const newNode: INode = {
          ...sourceNode,
          id: `${sourceNode.type}-${crypto.randomUUID()}`,
          position: {
            x: sourceNode.position.x + 40,
            y: sourceNode.position.y + 40,
          },
          config: { ...sourceNode.config },
          ports: Object.keys(sourceNode.ports).reduce((acc, portId) => {
            acc[portId] = { ...sourceNode.ports[portId] }
            return acc
          }, {} as typeof sourceNode.ports),
          uiState: {
            status: 'default',
            configCompleteStatus: 'not_started',
          },
        }
        return { nodes: [...s.nodes, newNode] }
      }),
      reorderNodes: (startIndex, endIndex) => set((s) => {
        const newNodes = [...s.nodes]
        const [removed] = newNodes.splice(startIndex, 1)
        newNodes.splice(endIndex, 0, removed)
        return { nodes: newNodes }
      }),
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
