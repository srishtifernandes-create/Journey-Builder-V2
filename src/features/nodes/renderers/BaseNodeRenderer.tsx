import React, { ReactNode } from 'react'
import { Handle, Position } from '@xyflow/react'
import clsx from 'clsx'
import type { INode } from '../contracts/INode'
import { NodeRegistry } from '../registry/NodeRegistry'

export interface BaseNodeRendererProps {
  node: INode
  selected?: boolean
  children: ReactNode
}

export function BaseNodeRenderer({ node, selected, children }: BaseNodeRendererProps) {
  // Resolve static metadata from the registry
  const metadata = NodeRegistry.getNodeMetadata(node.type)
  const displayName = metadata?.displayName || node.type

  // Status indicators for configuration completeness
  const statusColors = {
    not_started: 'bg-neutral-200 border-neutral-300',
    incomplete: 'bg-amber-100 border-amber-300 text-amber-700',
    complete: 'bg-emerald-100 border-emerald-300 text-emerald-700',
  }

  const statusLabel = {
    not_started: 'Draft',
    incomplete: 'Incomplete',
    complete: 'Ready',
  }

  // Render input handles at the top, output handles at the bottom
  const portsList = Object.values(node.ports)
  const inputPorts = portsList.filter((p) => p.type === 'input')
  const outputPorts = portsList.filter((p) => p.type === 'output')

  return (
    <div
      className={clsx(
        'relative bg-white border rounded-xl shadow-sm transition-all duration-200 min-h-[64px] flex flex-col justify-between group p-3 select-none',
        selected
          ? 'border-primary-500 ring-2 ring-primary-100'
          : 'border-neutral-200 hover:border-neutral-400'
      )}
      style={{ width: '100%', height: '100%', outline: 'none' }}
    >
      {/* Input Handles (React Flow Target Ports) */}
      {inputPorts.map((port, idx) => {
        const leftPercent = inputPorts.length > 1 
          ? `${((idx + 1) * 100) / (inputPorts.length + 1)}%` 
          : '50%'
        return (
          <Handle
            key={port.id}
            type="target"
            position={Position.Top}
            id={port.id}
            style={{
              left: leftPercent,
              background: '#E5E7EB',
              border: '1.5px solid #9CA3AF',
              width: '8px',
              height: '8px',
            }}
            className="hover:scale-125 transition-transform"
          />
        )
      })}

      {/* Node Header Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider">
            {node.type}
          </span>
        </div>

        {/* Status Badge */}
        <span
          className={clsx(
            'px-1.5 py-0.5 rounded text-[8px] font-medium border uppercase tracking-wider',
            statusColors[node.uiState.configCompleteStatus]
          )}
        >
          {statusLabel[node.uiState.configCompleteStatus]}
        </span>
      </div>

      {/* Main Node Card Specific Content */}
      <div className="flex-1 text-sm font-semibold text-neutral-900 truncate">
        {children}
      </div>

      {/* Output Handles (React Flow Source Ports) */}
      {outputPorts.map((port, idx) => {
        const leftPercent = outputPorts.length > 1 
          ? `${((idx + 1) * 100) / (outputPorts.length + 1)}%` 
          : '50%'
        return (
          <Handle
            key={port.id}
            type="source"
            position={Position.Bottom}
            id={port.id}
            style={{
              left: leftPercent,
              background: '#E5E7EB',
              border: '1.5px solid #9CA3AF',
              width: '8px',
              height: '8px',
            }}
            className="hover:scale-125 transition-transform"
          />
        )
      })}
    </div>
  )
}
