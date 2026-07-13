import type { INode, PortState, Position } from './INode'
import type { PortDefinition } from './INodeRegistry'

export interface IPortFactory {
  createPorts(definitions: PortDefinition[]): Record<string, PortState>
}

export interface INodeFactory {
  createNode(type: string, position: Position): INode
}
