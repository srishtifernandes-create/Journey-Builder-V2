import React from 'react'
import { CanvasBoundary } from '../../canvas/components/CanvasBoundary'
import CanvasViewport from '../../canvas/components/CanvasViewport'

export function WorkspaceCanvas() {
  return (
    <div className="w-full h-full relative bg-neutral-50 overflow-hidden">
      <CanvasBoundary state="empty">
        <CanvasViewport />
      </CanvasBoundary>
    </div>
  )
}
