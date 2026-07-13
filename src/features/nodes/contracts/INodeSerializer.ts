import type { INode } from './INode'

export interface SerializedNode {
  readonly id: string
  readonly type: string
  readonly schemaVersion: number
  readonly position: { readonly x: number; readonly y: number }
  readonly config: Record<string, any>
}

export interface INodeSerializer {
  serialize(node: INode): SerializedNode
  deserialize(serialized: SerializedNode): INode
}
