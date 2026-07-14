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

  // A node created via NodeCreationService is selected programmatically.
  // Shortly after that node mounts, React Flow's own reconciliation against
  // its controlled `selected` prop emits an unprompted alternating sequence
  // of onSelectionChange calls for that node — [] then [nodeId] then [] ...
  // (see BUGFIX_002_NODE_CREATION_LOOP.md, Phases 1-4). Relaying any of
  // those alternating values into selectionStore feeds the very prop change
  // React Flow is reconciling against, producing the next alternation —
  // an unbounded round trip, not a one-time echo. Pinning the programmatic
  // selection and ignoring every emission that merely flips between "that
  // node" and "nothing" breaks the round trip at its source. The pin is
  // replaced by the next node creation, or lifted by any emission that
  // reports a genuinely different target (a different node/edge id) —
  // which can only originate from a real subsequent user gesture, since
  // React Flow's own reconciliation never invents a selection target the
  // application didn't already set.
  const pinnedNodeIdRef = useRef<string | null>(null)

  useEffect(() => {
    // 0. Bind the node creation service. NodeCreationService never touches a
    // store directly — its selectNode dep routes through CanvasRuntime's
    // SelectionManager, which only emits intent (see step 1 below for the
    // single place that intent becomes a selectionStore write).
    const nodeCreation = new NodeCreationService({
      instantiate: (type, position) => NodeFactory.createNode(type, position),
      addNode: (node) => useJourneyStore.getState().addNode(node),
      selectNode: (nodeId) => runtime.selection.selectNode(nodeId),
    })
    runtime.bindNodeCreation(nodeCreation)

    const unsubscribeNodeCreated = runtime.events.on('nodeCreated', ({ nodeId }) => {
      pinnedNodeIdRef.current = nodeId
    })

    // 1. Subscribe to canvas selection intent via the Event Pipeline.
    // This is the ONLY place in the codebase permitted to write to
    // selectionStore. SelectionManager (the emitter) never imports Zustand.
    const unsubscribeSelection = runtime.events.on('selectionChange', (selection) => {
      const selectedNode = selection.nodes[0] || null
      const selectedEdge = selection.edges[0] || null

      const pinned = pinnedNodeIdRef.current
      if (pinned !== null && selectedEdge === null && (selectedNode === pinned || selectedNode === null)) {
        // Reconciliation alternating between the pinned node and empty —
        // not new intent. Drop it without writing to selectionStore.
        return
      }

      // Any other emission (a different node, an edge, or an empty
      // selection once nothing is pinned) is real and lifts the pin.
      pinnedNodeIdRef.current = null
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
      unsubscribeNodeCreated()
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
