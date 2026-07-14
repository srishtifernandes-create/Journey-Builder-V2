import React, { useEffect, useMemo, useCallback, useRef } from 'react'
import { ReactFlow, Background, useReactFlow, ReactFlowProvider, applyNodeChanges, applyEdgeChanges, type NodeChange, type EdgeChange, type Connection } from '@xyflow/react'
import { ReactFlowAdapter } from '../runtime/adapters/ReactFlowAdapter'
import { useCanvasEngine } from './CanvasEngineProvider'
import { useJourneyStore } from '../../../app/store/journeyStore'
import { useSelectionStore } from '../../../app/store/selectionStore'
import { RendererRegistry } from '../../nodes/registry/RendererRegistry'
import '@xyflow/react/dist/style.css'

const FALLBACK_NODE_TYPE = '__fallback__'

// Business-owned NodeChange types: changes that represent something a Journey
// author did (moved a node, deleted a node). Everything else React Flow
// reports (e.g. `dimensions`) is renderer-owned state and must never be
// persisted to journeyStore — see BUGFIX_001_SELECTION_FIREHOSE_FIX.md.
const BUSINESS_OWNED_CHANGE_TYPES = new Set<NodeChange['type']>(['position', 'remove', 'select'])
const BUSINESS_OWNED_EDGE_CHANGE_TYPES = new Set<EdgeChange['type']>(['remove', 'select'])

function isBusinessOwnedChange(change: NodeChange): boolean {
  return BUSINESS_OWNED_CHANGE_TYPES.has(change.type)
}

function isBusinessOwnedEdgeChange(change: EdgeChange): boolean {
  return BUSINESS_OWNED_EDGE_CHANGE_TYPES.has(change.type)
}

function CanvasViewportInner() {
  const reactFlow = useReactFlow()
  // Selection is read through the runtime/context layer (Decision 014) —
  // never from journeyStore, never from selectionStore directly.
  const { runtime, selectedNodeId } = useCanvasEngine()
  const nodes = useJourneyStore((s) => s.nodes)
  const edges = useJourneyStore((s) => s.edges)
  const setNodes = useJourneyStore((s) => s.setNodes)
  const setEdges = useJourneyStore((s) => s.setEdges)
  const selectedEdgeId = useSelectionStore((s) => s.selectedEdgeId)
  const containerRef = useRef<HTMLDivElement>(null)

  const adapter = useMemo(() => new ReactFlowAdapter(), [])

  // Map registered node renderers to React Flow nodeTypes, plus the fallback renderer
  const nodeTypes = useMemo(() => {
    const types: Record<string, any> = {
      [FALLBACK_NODE_TYPE]: RendererRegistry.getRenderer(FALLBACK_NODE_TYPE).component,
    }
    RendererRegistry.getAllRenderers().forEach((def) => {
      types[def.type] = def.component
    })
    return types
  }, [])

  // Map canvas nodes to React Flow node schema. Selection comes from
  // selectedNodeId (sourced from context, ultimately selectionStore) per
  // Decision 014 — never from journeyStore's uiState. Unregistered types are
  // remapped to the fallback key so React Flow never throws on an unknown
  // node.type.
  const rfNodes = useMemo(() => {
    return nodes.map((node) => ({
      id: node.id,
      type: RendererRegistry.hasRenderer(node.type) ? node.type : FALLBACK_NODE_TYPE,
      position: node.position,
      data: { node },
      selected: node.id === selectedNodeId,
    }))
  }, [nodes, selectedNodeId])

  const rfEdges = useMemo(() => {
    return edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      selected: edge.id === selectedEdgeId,
    }))
  }, [edges, selectedEdgeId])

  // Synchronize React Flow position/drag changes back into journeyStore.
  // Only business-owned changes (position, remove) are persisted — renderer-owned
  // changes (e.g. `dimensions`) are excluded so journeyStore never mutates in
  // response to React Flow's own layout measurement. See
  // BUGFIX_001_SELECTION_FIREHOSE_FIX.md. Selection intent is captured here
  // by filtering 'select' changes, bypassing the onSelectionChange loop from
  // BUGFIX_002.
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    if (!changes.some(isBusinessOwnedChange)) {
      return
    }

    const selectChanges = changes.filter((c) => c.type === 'select')
    if (selectChanges.length > 0) {
      // Find the single selected node, if any
      const newlySelected = selectChanges.find((c) => 'selected' in c && c.selected)
      if (newlySelected) {
        adapter.triggerSelectionChange([newlySelected.id], [])
      } else if (selectChanges.every((c) => 'selected' in c && !c.selected)) {
        // Only clear if ALL select changes are deselections
        adapter.triggerSelectionChange([], [])
      }
    }

    const positionOrRemoveChanges = changes.filter((c) => c.type === 'position' || c.type === 'remove')
    if (positionOrRemoveChanges.length === 0) return

    const currentNodes = useJourneyStore.getState().nodes

    const rfNodesFormatted = currentNodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: { node: n },
      selected: n.id === selectedNodeId,
    }))

    const updatedRfNodes = applyNodeChanges(positionOrRemoveChanges, rfNodesFormatted)

    const updatedNodes = updatedRfNodes.map((rfNode: any) => {
      const originalNode = rfNode.data.node
      return {
        ...originalNode,
        position: rfNode.position,
      }
    })

    setNodes(updatedNodes)
  }, [setNodes, selectedNodeId, adapter])

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    if (!changes.some(isBusinessOwnedEdgeChange)) {
      return
    }

    const selectChanges = changes.filter((c) => c.type === 'select')
    if (selectChanges.length > 0) {
      const newlySelected = selectChanges.find((c) => 'selected' in c && c.selected)
      if (newlySelected) {
        adapter.triggerSelectionChange([], [newlySelected.id])
      } else if (selectChanges.every((c) => 'selected' in c && !c.selected)) {
        adapter.triggerSelectionChange([], [])
      }
    }

    const removeChanges = changes.filter((c) => c.type === 'remove')
    if (removeChanges.length === 0) return

    const currentEdges = useJourneyStore.getState().edges
    const rfEdgesFormatted = currentEdges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
      selected: e.id === selectedEdgeId,
    }))

    const updatedRfEdges = applyEdgeChanges(removeChanges, rfEdgesFormatted)

    const updatedEdges = updatedRfEdges.map((rfEdge: any) => ({
      id: rfEdge.id,
      source: rfEdge.source,
      target: rfEdge.target,
      sourceHandle: rfEdge.sourceHandle,
      targetHandle: rfEdge.targetHandle,
    }))

    setEdges(updatedEdges)
  }, [setEdges, selectedEdgeId, adapter])

  const onConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target) return
    if (params.source === params.target) return

    const newEdge = {
      id: `edge-${crypto.randomUUID()}`,
      source: params.source,
      target: params.target,
      sourceHandle: params.sourceHandle || undefined,
      targetHandle: params.targetHandle || undefined,
    }
    useJourneyStore.getState().addEdge(newEdge)
  }, [])

  useEffect(() => {
    // Lifecycle: Mount Adapter -> bind reactFlowInstance -> Register Managers
    adapter.setInstance(reactFlow)
    runtime.bindAdapter(adapter)
    runtime.bindViewportCenterProvider(() => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return { x: 0, y: 0 }
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    })

    return () => {
      // Lifecycle: Unmount Detach
      adapter.setInstance(null)
    }
  }, [reactFlow, runtime, adapter])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes('application/x-jb-node-type')) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const nodeType = e.dataTransfer.getData('application/x-jb-node-type')
      if (!nodeType) return
      e.preventDefault()
      runtime.createNodeAtScreenPoint(nodeType, e.clientX, e.clientY)
    },
    [runtime]
  )

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      style={{ outline: 'none' }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodesDraggable={true} // enable node dragging
        nodesConnectable={true}
        onConnect={onConnect}
        elementsSelectable={true} // enable elements selection for nodes
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnDrag={true}
        panOnScroll={false}
        minZoom={0.25}
        maxZoom={2.0}
        onMove={(_, viewport) => adapter.triggerViewportChange(viewport)}
        onPaneClick={(e) => adapter.triggerPaneClick(e.nativeEvent)}
        onPaneContextMenu={(e) => {
          e.preventDefault()
          adapter.triggerPaneContextMenu(e.nativeEvent)
        }}

      >
        <Background color="#ccc" gap={20} size={1} />
      </ReactFlow>
    </div>
  )
}

export default function CanvasViewport() {
  return (
    <ReactFlowProvider>
      <CanvasViewportInner />
    </ReactFlowProvider>
  )
}
