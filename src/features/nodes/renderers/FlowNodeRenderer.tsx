import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { GitBranch } from 'lucide-react'
import clsx from 'clsx'
import type { INode } from '../contracts/INode'
import { useNodeRenderer } from '../hooks/useNodeRenderer'

export interface FlowNodeRendererProps {
  data: {
    node: INode
  }
  selected?: boolean
}

export function FlowNodeRenderer({ data, selected }: FlowNodeRendererProps) {
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
        'node node-screen',
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

      <div className="row-top">
        <span className="kind">
          <GitBranch className="w-3 h-3 text-neutral-400" />
          Flow
        </span>
        <span className={clsx(
          'status-dot',
          isError ? 'error' : isIncomplete ? 'warn' : 'pending'
        )}></span>
      </div>

      <div className="name truncate">{title}</div>

      <div className="row-bottom">
        <span className="type-badge" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
          FLOW
        </span>
        <span className="field-count">Control step</span>
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

export default FlowNodeRenderer
