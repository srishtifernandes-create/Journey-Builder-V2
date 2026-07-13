import React from 'react'
import { PaletteSearch } from './PaletteSearch'
import { NodeCategory } from './NodeCategory'
import { usePalette } from '../hooks/usePalette'

export function NodePalette() {
  const { search, setSearch, categories, getItemsForCategory } = usePalette()

  return (
    <div className="h-full w-full flex flex-col bg-white border-r border-neutral-200">
      <PaletteSearch value={search} onChange={setSearch} />
      <div className="flex-1 overflow-y-auto px-3 py-3">
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
