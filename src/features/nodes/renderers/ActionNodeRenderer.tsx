import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Play } from 'lucide-react'
import clsx from 'clsx'
import type { INode } from '../contracts/INode'
import { useNodeRenderer } from '../hooks/useNodeRenderer'

export interface ActionNodeRendererProps {
  data: {
    node: INode
  }
  selected?: boolean
}

export function ActionNodeRenderer({ data, selected }: ActionNodeRendererProps) {
  const { node } = data
  const { metadata } = useNodeRenderer(node.type)
  const title = node.config.title || metadata.displayName

  const status = node.uiState.status
  const isError = status === 'error'
  const isIncomplete = status === 'incomplete'
  const isHover = status === 'hover'

  return (
    <div
      tabIndex={0}
      className={clsx(
        'node node-action',
        selected && 'state-selected',
        isError && 'state-error',
        isIncomplete && 'state-incomplete',
        isHover && 'state-hover'
      )}
    >
      {/* Input Port Handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        className={clsx('port in', selected && 'filled')}
      />

      <span className="action-icon">
        <Play className="w-2.5 h-2.5 fill-current" />
      </span>

      <div className="text-block">
        <span className="kind">Action</span>
        <span className="name truncate w-[90px]">{title}</span>
      </div>

      {/* Output Port Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        className={clsx('port out', selected && 'filled')}
      />
    </div>
  )
}

export default ActionNodeRenderer
