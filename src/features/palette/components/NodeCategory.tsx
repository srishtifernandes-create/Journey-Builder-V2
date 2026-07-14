import React, { useState } from 'react'
import { NodeCard } from './NodeCard'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { IPaletteItem } from '../contracts/IPaletteItem'

export interface NodeCategoryProps {
  category: string
  items: IPaletteItem[]
}

export function NodeCategory({ category, items }: NodeCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  if (items.length === 0) return null

  return (
    <div className="mb-3 select-none">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-1.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded transition-colors focus:outline-none"
      >
        <span>{category}</span>
        {isExpanded ? (
          <ChevronDown className="w-3 h-3 text-neutral-400" />
        ) : (
          <ChevronRight className="w-3 h-3 text-neutral-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="flex flex-col gap-1.5 mt-1">
          {items.map((item) => (
            <NodeCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
