import React from 'react'
import { Search } from 'lucide-react'

export interface PaletteSearchProps {
  value: string
  onChange: (value: string) => void
}

export function PaletteSearch({ value, onChange }: PaletteSearchProps) {
  return (
    <div className="relative px-3 py-2 border-b border-neutral-200">
      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search nodes..."
        className="w-full h-8 pl-7 pr-2 text-xs rounded-md border border-neutral-200 bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      />
    </div>
  )
}
