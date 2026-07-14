import React from 'react'
import { PaletteSearch } from './PaletteSearch'
import { NodeCategory } from './NodeCategory'
import { usePalette } from '../hooks/usePalette'

export function NodePalette() {
  const { search, setSearch, categories, getItemsForCategory } = usePalette()

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="px-3 pt-2 pb-1.5 shrink-0">
        <PaletteSearch value={search} onChange={setSearch} />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
        {categories.length === 0 ? (
          <div className="text-xs text-neutral-400 text-center py-6">No nodes found.</div>
        ) : (
          categories.map((category) => (
            <NodeCategory key={category} category={category} items={getItemsForCategory(category)} />
          ))
        )}
      </div>
    </div>
  )
}
