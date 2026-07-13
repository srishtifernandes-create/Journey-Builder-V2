import React from 'react'
import { NodeCard } from './NodeCard'
import type { IPaletteItem } from '../contracts/IPaletteItem'

export interface NodeCategoryProps {
  category: string
  items: IPaletteItem[]
}

export function NodeCategory({ category, items }: NodeCategoryProps) {
  if (items.length === 0) return null

  return (
    <div className="mb-4">
      <div className="px-1 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
        {category}
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <NodeCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
