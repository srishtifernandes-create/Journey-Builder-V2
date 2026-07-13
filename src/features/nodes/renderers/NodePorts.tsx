import React from 'react'
import { Handle, Position } from '@xyflow/react'
import type { PortState } from '../contracts/INode'
import type { PortPosition } from '../contracts/INodeRenderer'

export interface NodePortsProps {
  ports: Record<string, PortState>
  supportsPorts: PortPosition[]
}

const SIDE_TO_HANDLE_TYPE: Record<'top' | 'left', 'target'> & Record<'bottom' | 'right', 'source'> = {
  top: 'target',
  left: 'target',
  bottom: 'source',
  right: 'source',
} as const

const SIDE_TO_RF_POSITION: Record<PortPosition, Position> = {
  top: Position.Top,
  bottom: Position.Bottom,
  left: Position.Left,
  right: Position.Right,
}

function offsetForIndex(index: number, count: number): string {
  return count > 1 ? `${((index + 1) * 100) / (count + 1)}%` : '50%'
}

export function NodePorts({ ports, supportsPorts }: NodePortsProps) {
  const portsList = Object.values(ports)

  return (
    <>
      {supportsPorts.map((side) => {
        const handleType = SIDE_TO_HANDLE_TYPE[side]
        const sidePorts = portsList.filter((p) => (handleType === 'target' ? p.type === 'input' : p.type === 'output'))
        const isHorizontalAxis = side === 'top' || side === 'bottom'

        return sidePorts.map((port, idx) => {
          const offset = offsetForIndex(idx, sidePorts.length)
          return (
            <Handle
              key={port.id}
              type={handleType}
              position={SIDE_TO_RF_POSITION[side]}
              id={port.id}
              style={{
                [isHorizontalAxis ? 'left' : 'top']: offset,
                background: '#E5E7EB',
                border: '1.5px solid #9CA3AF',
                width: '8px',
                height: '8px',
              }}
              className="hover:scale-125 transition-transform"
            />
          )
        })
      })}
    </>
  )
}
