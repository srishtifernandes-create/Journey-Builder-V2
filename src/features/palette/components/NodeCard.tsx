import React from 'react'
import * as Icons from 'lucide-react'
import { useCanvasRuntime } from '../../canvas/hooks/useCanvasRuntime'
import { useJourneyStore } from '../../../app/store/journeyStore'
import type { IPaletteItem } from '../contracts/IPaletteItem'

export interface NodeCardProps {
  item: IPaletteItem
}

export function NodeCard({ item }: NodeCardProps) {
  const runtime = useCanvasRuntime()
  const isJourneyEmpty = useJourneyStore((s) => s.nodes.length === 0)
  const shouldPulse = isJourneyEmpty && item.nodeType === 'consent_screen'

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/x-jb-node-type', item.nodeType)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleClick = () => {
    runtime.createNodeAtViewportCenter(item.nodeType)
  }

  // Resolve Lucide Icon dynamically
  const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle

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
      className={`relative flex items-start gap-2.5 p-2.5 rounded-lg border bg-white hover:shadow-sm hover:border-neutral-300 hover:bg-neutral-50/50 cursor-grab active:cursor-grabbing transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-1 border-neutral-200 overflow-hidden ${
        shouldPulse ? 'ring-2 ring-primary-500 animate-pulse' : ''
      }`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        item.category === 'Screen' ? 'bg-blue-500' : 
        item.category === 'API' ? 'bg-purple-500' : 
        item.category === 'Flow' || item.category === 'Decision' ? 'bg-amber-500' : 
        item.category === 'Terminal' || item.category === 'Navigation' ? 'bg-emerald-500' : 
        'bg-slate-400'
      }`} />
      
      <div className="w-6 h-6 flex-shrink-0 rounded flex items-center justify-center text-neutral-500 bg-neutral-100">
        <IconComponent className="w-3.5 h-3.5 stroke-[2]" />
      </div>
      
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-neutral-800 truncate">{item.displayName}</div>
        <div className="text-[10px] text-neutral-400 truncate mt-0.5">{item.description}</div>
      </div>
    </div>
  )
}
