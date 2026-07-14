import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Webhook } from 'lucide-react'
import clsx from 'clsx'
import type { INode } from '../contracts/INode'
import { useNodeRenderer } from '../hooks/useNodeRenderer'

export interface ApiNodeRendererProps {
  data: {
    node: INode
  }
  selected?: boolean
}

export function ApiNodeRenderer({ data, selected }: ApiNodeRendererProps) {
  const { node } = data
  const { metadata } = useNodeRenderer(node.type)
  const title = node.config.title || metadata.displayName
  const endpoint = node.config.endpoint || 'POST /api/v1/execute'

  const status = node.uiState.status
  const isError = status === 'error'
  const isIncomplete = status === 'incomplete'
  const isHover = status === 'hover'

  return (
    <div
      tabIndex={0}
      className={clsx(
        'node node-api',
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
        <span className="api-icon">
          <Webhook className="w-3 h-3 text-[#4DC4E8]" />
        </span>
        <div>
          <div className="kind">API Check</div>
          <div className="name truncate w-[110px]">{title}</div>
        </div>
      </div>

      <span className="api-endpoint">{endpoint}</span>

      <span className="api-timing">
        <span className={clsx(
          'status-dot',
          isError ? 'error' : isIncomplete ? 'warn' : 'pending'
        )}></span>
        Configured
      </span>

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

export default ApiNodeRenderer
