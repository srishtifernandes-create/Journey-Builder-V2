import React, { createContext, ReactNode, useContext, useEffect, useMemo, useRef } from 'react'
import { CanvasRuntime } from '../runtime/CanvasRuntime'
import { useSelectionStore } from '../../../app/store/selectionStore'
import { useCanvasStore } from '../../../app/store/canvasStore'
import { useJourneyStore } from '../../../app/store/journeyStore'
import { NodeFactory } from '../../nodes/factory/NodeFactory'
import { NodeCreationService } from '../../nodes/services/NodeCreationService'

export interface CanvasEngineContextType {
  runtime: CanvasRuntime
  selectedNodeId: string | null
}

const CanvasEngineContext = createContext<CanvasEngineContextType | null>(null)

export function CanvasEngineProvider({ children }: { children: ReactNode }) {
  const runtime = useMemo(() => new CanvasRuntime(), [])
  const selectedNodeId = useSelectionStore((s) => s.selectedNodeId)
  const selectNode = useSelectionStore((s) => s.selectNode)
  const setSelectedEdgeId = useSelectionStore((s) => s.setSelectedEdgeId)
  const setZoom = useCanvasStore((s) => s.setZoom)
  const setPan = useCanvasStore((s) => s.setPan)


  useEffect(() => {
    // 0. Bind the node creation service. NodeCreationService never touches a
    // store directly — its selectNode dep routes through CanvasRuntime's
    // SelectionManager, which only emits intent (see step 1 below for the
    // single place that intent becomes a selectionStore write).
    const nodeCreation = new NodeCreationService({
      instantiate: (type, position) => NodeFactory.createNode(type, position),
      addNode: (node) => useJourneyStore.getState().addNode(node),
      selectNode: (nodeId) => runtime.selection.selectNode(nodeId),
      onNodeCreated: (nodeId) => runtime.events.emit('nodeCreated', { nodeId, type: 'unknown' })
    })
    runtime.bindNodeCreation(nodeCreation)


    // 1. Subscribe to canvas selection intent via the Event Pipeline.
    // This is the ONLY place in the codebase permitted to write to
    // selectionStore. SelectionManager (the emitter) never imports Zustand.
    const unsubscribeSelection = runtime.events.on('selectionChange', (selection) => {
      const selectedNode = selection.nodes[0] || null
      const selectedEdge = selection.edges[0] || null

      selectNode(selectedNode)
      setSelectedEdgeId(selectedEdge)
    })

    // 2. Subscribe to canvas viewport changes via the Event Pipeline
    const unsubscribeViewport = runtime.events.on('viewportChange', (viewport) => {
      setZoom(viewport.zoom)
      setPan({ x: viewport.x, y: viewport.y })
    })

    // Dispose runtime and clear listeners on unmount
    return () => {
      unsubscribeSelection()
      unsubscribeViewport()
      runtime.dispose()
    }
  }, [runtime, selectNode, setSelectedEdgeId, setZoom, setPan])

  return (
    <CanvasEngineContext.Provider value={{ runtime, selectedNodeId }}>
      {children}
    </CanvasEngineContext.Provider>
  )
}

export function useCanvasEngine() {
  const context = useContext(CanvasEngineContext)
  if (!context) {
    throw new Error('useCanvasEngine must be used within a CanvasEngineProvider')
  }
  return context
}
