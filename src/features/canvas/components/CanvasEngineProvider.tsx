import React, { createContext, ReactNode, useContext, useEffect, useMemo } from 'react'
import { CanvasRuntime } from '../runtime/CanvasRuntime'
import { useSelectionStore } from '../../../app/store/selectionStore'
import { useCanvasStore } from '../../../app/store/canvasStore'

export interface CanvasEngineContextType {
  runtime: CanvasRuntime
}

const CanvasEngineContext = createContext<CanvasEngineContextType | null>(null)

export function CanvasEngineProvider({ children }: { children: ReactNode }) {
  const runtime = useMemo(() => new CanvasRuntime(), [])
  const setSelectedNodeId = useSelectionStore((s) => s.setSelectedNodeId)
  const setSelectedEdgeId = useSelectionStore((s) => s.setSelectedEdgeId)
  const setZoom = useCanvasStore((s) => s.setZoom)
  const setPan = useCanvasStore((s) => s.setPan)

  useEffect(() => {
    // 1. Subscribe to canvas selection changes via the Event Pipeline
    const unsubscribeSelection = runtime.events.on('selectionChange', (selection) => {
      const selectedNode = selection.nodes[0] || null
      const selectedEdge = selection.edges[0] || null
      setSelectedNodeId(selectedNode)
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
  }, [runtime, setSelectedNodeId, setSelectedEdgeId, setZoom, setPan])

  return (
    <CanvasEngineContext.Provider value={{ runtime }}>
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
