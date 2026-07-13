import React from 'react'
import { ReactFlow, Background } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

export default function CanvasViewport() {
  return (
    <div className="w-full h-full relative" style={{ outline: 'none' }}>
      <ReactFlow
        nodes={[]}
        edges={[]}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnDrag={false}
        nodesFocusable={false}
        edgesFocusable={false}
        minZoom={1}
        maxZoom={1}
      >
        <Background color="#ccc" gap={20} size={1} />
      </ReactFlow>
    </div>
  )
}
