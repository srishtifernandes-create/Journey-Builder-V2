import React, { useEffect, useMemo } from 'react'
import { ReactFlow, Background, useReactFlow, ReactFlowProvider } from '@xyflow/react'
import { ReactFlowAdapter } from '../runtime/adapters/ReactFlowAdapter'
import { useCanvasRuntime } from '../hooks/useCanvasRuntime'
import '@xyflow/react/dist/style.css'

function CanvasViewportInner() {
  const reactFlow = useReactFlow()
  const runtime = useCanvasRuntime()

  const adapter = useMemo(() => new ReactFlowAdapter(), [])

  useEffect(() => {
    // Lifecycle: Mount Adapter -> bind reactFlowInstance -> Register Managers
    adapter.setInstance(reactFlow)
    runtime.bindAdapter(adapter)

    return () => {
      adapter.setInstance(null)
    }
  }, [reactFlow, runtime, adapter])

  return (
    <div className="w-full h-full relative" style={{ outline: 'none' }}>
      <ReactFlow
        nodes={[]}
        edges={[]}
        fitView
        // Canvas Runtime: enable pan & zoom actions
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
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
        onSelectionChange={({ nodes, edges }) =>
          adapter.triggerSelectionChange(
            nodes.map((n) => n.id),
            edges.map((e) => e.id)
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
