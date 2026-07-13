import type { INode } from './INode'
import type { SerializedNode } from './INodeSerializer'

export interface NodeValidationResult {
  valid: boolean
  errors?: string[]
}

export interface INodeLifecycle {
  onCreate(node: INode): void
  onInitialize(node: INode): void
  onMount(node: INode): void
  onUpdate(previous: INode, next: INode): void
  onSerialize(node: INode): SerializedNode
  onValidate(node: INode): NodeValidationResult
  onDelete(node: INode): void
}
