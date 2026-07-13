import React from 'react'
import { CanvasBoundary } from '../../canvas/components/CanvasBoundary'
import CanvasViewport from '../../canvas/components/CanvasViewport'
import { useJourneyStore } from '../../../app/store/journeyStore'

export function WorkspaceCanvas() {
  const nodes = useJourneyStore((s) => s.nodes)
  const hasNodes = nodes.length > 0

  return (
    <div className="w-full h-full relative bg-neutral-50 overflow-hidden">
      <CanvasBoundary state={hasNodes ? 'ready' : 'empty'}>
        <CanvasViewport />
      </CanvasBoundary>
    </div>
  )
}
