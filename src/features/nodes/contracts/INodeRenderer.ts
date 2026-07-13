import type { ComponentType } from 'react'
import type { INode } from './INode'

export type PortPosition = 'top' | 'bottom' | 'left' | 'right'
export type ResizePolicy = 'fixed' | 'auto'

export interface RendererDefinition {
  readonly type: string
  readonly component: ComponentType<{ node: INode; selected?: boolean }>
  readonly defaultWidth: number
  readonly defaultHeight: number
  readonly minWidth: number
  readonly minHeight: number
  readonly supportsPorts: PortPosition[]
  readonly resizePolicy: ResizePolicy
  // Reserved for future rendering concerns — populated by later sprints without
  // requiring another shape change to this contract.
  readonly style?: Record<string, unknown>
}

export interface IRendererRegistry {
  registerRenderer(definition: RendererDefinition): void
  unregisterRenderer(type: string): void
  getRenderer(type: string): RendererDefinition
  hasRenderer(type: string): boolean
  getAllRenderers(): RendererDefinition[]
}
