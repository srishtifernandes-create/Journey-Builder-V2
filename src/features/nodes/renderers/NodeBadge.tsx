import React from 'react'
import clsx from 'clsx'
import type { NodeUIState } from '../contracts/INode'

export interface NodeBadgeProps {
  configCompleteStatus: NodeUIState['configCompleteStatus']
}

const STATUS_COLORS: Record<NodeUIState['configCompleteStatus'], string> = {
  not_started: 'bg-neutral-100 border-neutral-200 text-neutral-500',
  incomplete: 'bg-neutral-100 border-neutral-200 text-neutral-600',
  complete: 'bg-neutral-100 border-neutral-200 text-neutral-800',
}

const STATUS_LABELS: Record<NodeUIState['configCompleteStatus'], string> = {
  not_started: 'Draft',
  incomplete: 'Incomplete',
  complete: 'Ready',
}

export function NodeBadge({ configCompleteStatus }: NodeBadgeProps) {
  return (
    <span
      className={clsx(
        'px-1.5 py-0.5 rounded text-[8px] font-medium border uppercase tracking-wider',
        STATUS_COLORS[configCompleteStatus]
      )}
    >
      {STATUS_LABELS[configCompleteStatus]}
    </span>
  )
}
