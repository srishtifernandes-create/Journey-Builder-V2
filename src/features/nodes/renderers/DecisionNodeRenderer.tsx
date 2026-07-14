import React from 'react'
import { Handle, Position } from '@xyflow/react'
import clsx from 'clsx'
import type { INode } from '../contracts/INode'
import { useNodeRenderer } from '../hooks/useNodeRenderer'

export interface DecisionNodeRendererProps {
  data: {
    node: INode
  }
  selected?: boolean
}

export function DecisionNodeRenderer({ data, selected }: DecisionNodeRendererProps) {
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
        'node node-decision',
        selected && 'state-selected',
        isError && 'state-error',
        isIncomplete && 'state-incomplete',
        isHover && 'state-hover'
      )}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        className={clsx('port in', selected && 'filled')}
      />

      <span className="kind">Decision</span>
      <span className="name truncate w-full px-2">{title}</span>

      {/* Output Handle Left (No) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        style={{ left: '22%', transform: 'translateX(-50%)' }}
        className={clsx('port out left', selected && 'filled')}
      />

      {/* Output Handle Right (Yes) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        style={{ left: '78%', transform: 'translateX(-50%)' }}
        className={clsx('port out right', selected && 'filled')}
      />

      <div className="decision-branch-labels">
        <span className="branch-tag no">NO</span>
        <span className="branch-tag yes">YES</span>
      </div>
    </div>
  )
}

export default DecisionNodeRenderer
