import type { INodeFactory } from '../contracts/INodeFactory'
import type { INode, Position } from '../contracts/INode'
import { NodeRegistry } from '../registry/NodeRegistry'
import { PortFactory } from './PortFactory'

export class NodeFactoryImpl implements INodeFactory {
  public createNode(type: string, position: Position): INode {
    const registration = NodeRegistry.getNode(type)
    if (!registration) {
      throw new Error(`Cannot create node: type "${type}" is not registered.`)
    }

    // Generate runtime identifier
    const id = `${type}-${crypto.randomUUID()}`

    return {
      id,
      type,
      schemaVersion: registration.metadata.schemaVersion,
      position,
      config: { ...registration.defaultConfig },
      ports: PortFactory.createPorts(registration.initialPorts),
      capabilities: { ...registration.capabilities },
      uiState: {
        status: 'default',
        configCompleteStatus: 'not_started',
      },
    }
  }
}

export const NodeFactory = new NodeFactoryImpl()
export default NodeFactory
