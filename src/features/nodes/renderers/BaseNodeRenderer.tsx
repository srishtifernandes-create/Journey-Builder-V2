import React, { ReactNode } from 'react'
import clsx from 'clsx'
import type { INode } from '../contracts/INode'
import type { NodeMetadata } from '../contracts/INodeRegistry'
import type { RendererDefinition } from '../contracts/INodeRenderer'
import { NodeHeader } from './NodeHeader'
import { NodeBadge } from './NodeBadge'
import { NodePorts } from './NodePorts'

export interface BaseNodeRendererProps {
  node: INode
  metadata: NodeMetadata
  definition: RendererDefinition
  selected?: boolean
  children: ReactNode
}

export function BaseNodeRenderer({ node, metadata, definition, selected, children }: BaseNodeRendererProps) {
  const isDisabled = node.uiState.status === 'error'

  return (
    <div
      tabIndex={0}
      title={metadata.displayName}
      className={clsx(
        'relative bg-white border rounded-xl shadow-sm transition-all duration-200 min-h-[64px] flex flex-col justify-between group p-3 select-none',
        'outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
        'hover:shadow-md hover:border-neutral-400',
        selected
          ? 'border-primary-500 ring-2 ring-primary-100'
          : 'border-neutral-200',
        isDisabled && 'opacity-50 pointer-events-none'
      )}
      style={{ width: '100%', height: '100%' }}
    >
      <NodePorts ports={node.ports} supportsPorts={definition.supportsPorts} />

      {/* Node Header Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <NodeHeader typeLabel={node.type} />
        <NodeBadge configCompleteStatus={node.uiState.configCompleteStatus} />
      </div>

      {/* Main Node Card Specific Content */}
      <div className="flex-1 text-sm font-semibold text-neutral-900 truncate">
        {children}
      </div>
    </div>
  )
}
