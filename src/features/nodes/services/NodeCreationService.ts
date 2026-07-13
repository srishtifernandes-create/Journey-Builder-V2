import type { INode, Position } from '../contracts/INode'

export interface NodeCreationDeps {
  instantiate: (type: string, position: Position) => INode
  addNode: (node: INode) => void
  selectNode: (nodeId: string) => void
}

export class NodeCreationService {
  constructor(private deps: NodeCreationDeps) {}

  public createNode(type: string, position: Position): INode {
    const node = this.deps.instantiate(type, position)
    this.deps.addNode(node)
    this.deps.selectNode(node.id)
    return node
  }
}
