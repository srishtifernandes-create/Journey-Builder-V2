import type { INodeSerializer, SerializedNode } from '../contracts/INodeSerializer'
import type { INode } from '../contracts/INode'
import { NodeFactory } from '../factory/NodeFactory'

export class NodeSerializerImpl implements INodeSerializer {
  public serialize(node: INode): SerializedNode {
    return {
      id: node.id,
      type: node.type,
      schemaVersion: node.schemaVersion,
      position: { x: node.position.x, y: node.position.y },
      config: { ...node.config },
    }
  }

  public deserialize(serialized: SerializedNode): INode {
    // 1. Create a runtime base node with registered defaults using NodeFactory
    const node = NodeFactory.createNode(serialized.type, {
      x: serialized.position.x,
      y: serialized.position.y,
    })

    // 2. Override id, schemaVersion, and configuration from serialized data
    return {
      ...node,
      id: serialized.id,
      schemaVersion: serialized.schemaVersion,
      config: { ...node.config, ...serialized.config },
    }
  }
}

export const NodeSerializer = new NodeSerializerImpl()
export default NodeSerializer
