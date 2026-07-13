import React, { useEffect, useMemo, useCallback, useRef } from 'react'
import { ReactFlow, Background, useReactFlow, ReactFlowProvider, applyNodeChanges, type NodeChange } from '@xyflow/react'
import { ReactFlowAdapter } from '../runtime/adapters/ReactFlowAdapter'
import { useCanvasRuntime } from '../hooks/useCanvasRuntime'
import { useJourneyStore } from '../../../app/store/journeyStore'
import { RendererRegistry } from '../../nodes/registry/RendererRegistry'
import '@xyflow/react/dist/style.css'

const FALLBACK_NODE_TYPE = '__fallback__'

function CanvasViewportInner() {
  const reactFlow = useReactFlow()
  const runtime = useCanvasRuntime()
  const nodes = useJourneyStore((s) => s.nodes)
  const setNodes = useJourneyStore((s) => s.setNodes)
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

  // Map canvas nodes to React Flow node schema with selection status mapping.
  // Unregistered types are remapped to the fallback key so React Flow never
  // throws on an unknown node.type.
  const rfNodes = useMemo(() => {
    return nodes.map((node) => ({
      id: node.id,
      type: RendererRegistry.hasRenderer(node.type) ? node.type : FALLBACK_NODE_TYPE,
      position: node.position,
      data: { node },
      selected: node.uiState.status === 'selected',
    }))
  }, [nodes])

  // Synchronize React Flow movements & selections back into journeyStore
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    const currentNodes = useJourneyStore.getState().nodes
    
    const rfNodesFormatted = currentNodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: { node: n },
      selected: n.uiState.status === 'selected',
    }))

    const updatedRfNodes = applyNodeChanges(changes, rfNodesFormatted)

    const updatedNodes = updatedRfNodes.map((rfNode: any) => {
      const originalNode = rfNode.data.node
      return {
        ...originalNode,
        position: rfNode.position,
        uiState: {
          ...originalNode.uiState,
          status: rfNode.selected ? 'selected' : 'default',
        },
      }
    })

    setNodes(updatedNodes)
  }, [setNodes])

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
        edges={[]}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        fitView
        nodesDraggable={true} // enable node dragging
        nodesConnectable={false}
        elementsSelectable={true} // enable elements selection for nodes
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnDrag={true}
        panOnScroll={false}
        minZoom={0.25}
        maxZoom={2.0}
        onMove={(_, viewport) => adapter.triggerViewportChange(viewport)}
        onPaneClick={(e) => adapter.triggerPaneClick(e.nativeEvent)}
        onPaneDoubleClick={(e) => adapter.triggerPaneDoubleClick(e.nativeEvent)}
        onPaneContextMenu={(e) => {
          e.preventDefault()
          adapter.triggerPaneContextMenu(e.nativeEvent)
        }}
        onSelectionChange={({ nodes: selNodes, edges: selEdges }) =>
          adapter.triggerSelectionChange(
            selNodes.map((n) => n.id),
            selEdges.map((e) => e.id)
          )
        }
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
