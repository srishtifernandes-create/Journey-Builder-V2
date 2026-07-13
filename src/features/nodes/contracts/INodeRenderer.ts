import type { ComponentType } from 'react'
import type { INode } from './INode'

export interface RendererDefinition {
  readonly type: string
  readonly component: ComponentType<{ node: INode }>
  readonly defaultWidth: number
  readonly defaultHeight: number
}

export interface IRendererRegistry {
  registerRenderer(definition: RendererDefinition): void
  unregisterRenderer(type: string): void
  getRenderer(type: string): RendererDefinition | undefined
  getAllRenderers(): RendererDefinition[]
}
