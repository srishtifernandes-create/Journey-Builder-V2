import type { NodeCapabilities } from './INode'

export interface PortDefinition {
  id: string
  type: 'input' | 'output'
  label?: string
}

export type NodeCategory = string

export interface NodeMetadata {
  type: string
  displayName: string
  description: string
  category: NodeCategory
  group: string
  icon: string
  keywords: string[]
  tags: string[]
  schemaVersion: number
  documentationUrl?: string
}

export interface NodeRegistration {
  type: string
  metadata: NodeMetadata
  capabilities: NodeCapabilities
  defaultConfig: Record<string, any>
  initialPorts: PortDefinition[]
  validationSchema?: any // Zod validation rules
}

export interface INodeRegistry {
  registerNode(registration: NodeRegistration): void
  unregisterNode(type: string): void
  getNode(type: string): NodeRegistration | undefined
  getNodeMetadata(type: string): NodeMetadata | undefined
  getAllNodes(): NodeRegistration[]
  getNodesByCategory(category: NodeCategory): NodeRegistration[]
  getNodesByGroup(group: string): NodeRegistration[]
}
