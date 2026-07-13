import React from 'react'

export interface NodeHeaderProps {
  typeLabel: string
}

export function NodeHeader({ typeLabel }: NodeHeaderProps) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <span className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider">
        {typeLabel}
      </span>
    </div>
  )
}
