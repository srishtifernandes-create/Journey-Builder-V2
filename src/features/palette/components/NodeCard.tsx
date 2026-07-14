import React from 'react'
import { useCanvasRuntime } from '../../canvas/hooks/useCanvasRuntime'
import { useJourneyStore } from '../../../app/store/journeyStore'
import type { IPaletteItem } from '../contracts/IPaletteItem'

export interface NodeCardProps {
  item: IPaletteItem
}

export function NodeCard({ item }: NodeCardProps) {
  const runtime = useCanvasRuntime()
  const isJourneyEmpty = useJourneyStore((s) => s.nodes.length === 0)
  const shouldPulse = isJourneyEmpty && item.nodeType === 'screen'

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/x-jb-node-type', item.nodeType)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleClick = () => {
    runtime.createNodeAtViewportCenter(item.nodeType)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick()
      }}
      className={`flex items-start gap-2 p-2 rounded-lg border bg-white hover:border-primary-400 hover:bg-primary-50/40 cursor-grab active:cursor-grabbing transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
        shouldPulse ? 'border-primary-400 animate-pulse' : 'border-neutral-200'
      }`}
    >
      <div className="w-7 h-7 flex-shrink-0 rounded-md bg-primary-50 flex items-center justify-center text-primary-600 text-[10px] font-mono uppercase">
        {item.icon.slice(0, 2)}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-neutral-900 truncate">{item.displayName}</div>
        <div className="text-[10px] text-neutral-500 truncate">{item.description}</div>
      </div>
    </div>
  )
}
