export interface Position {
  x: number
  y: number
}

export interface PortState {
  id: string
  type: 'input' | 'output'
  connected: boolean
  label?: string
}

export interface NodeUIState {
  status: 'default' | 'hover' | 'selected' | 'error' | 'incomplete'
  configCompleteStatus: 'not_started' | 'incomplete' | 'complete'
}

export interface NodeCapabilities {
  canHaveFields: boolean
  canRoute: boolean
  isIntegration: boolean
  isTerminal: boolean
}

export interface INode {
  id: string
  type: string
  schemaVersion: number
  position: Position
  config: Record<string, any>
  uiState: NodeUIState
  ports: Record<string, PortState>
  capabilities: NodeCapabilities
}
