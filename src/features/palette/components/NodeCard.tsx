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
      className="relative flex items-start gap-3 p-3 rounded-lg border bg-white hover:shadow-sm hover:border-neutral-300 hover:bg-neutral-50/50 cursor-grab active:cursor-grabbing transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-1 border-neutral-200 overflow-hidden"
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.category === 'Screens' ? 'bg-blue-500' : item.category === 'Backend' ? 'bg-purple-500' : item.category === 'Flow' ? 'bg-amber-500' : 'bg-slate-500'}`} />
      
      <div className="w-6 h-6 flex-shrink-0 rounded flex items-center justify-center text-neutral-600 bg-neutral-100 text-[10px] font-mono uppercase">
        {item.icon.slice(0, 2)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-neutral-900 truncate">{item.displayName}</div>
        <div className="text-[10px] text-neutral-500 truncate mt-0.5">{item.description}</div>
      </div>
    </div>
  )
}
