import type { IRendererRegistry, RendererDefinition } from '../contracts/INodeRenderer'
import { FALLBACK_DEFINITION } from '../renderers/FallbackNodeRenderer'

class RendererRegistryImpl implements IRendererRegistry {
  private renderers = new Map<string, RendererDefinition>()
  private readonly fallback: RendererDefinition = FALLBACK_DEFINITION

  public registerRenderer(definition: RendererDefinition): void {
    if (this.renderers.has(definition.type)) {
      throw new Error(`Renderer for type "${definition.type}" is already registered.`)
    }
    this.renderers.set(definition.type, definition)
  }

  public unregisterRenderer(type: string): void {
    this.renderers.delete(type)
  }

  public getRenderer(type: string): RendererDefinition {
    return this.renderers.get(type) ?? this.fallback
  }

  public hasRenderer(type: string): boolean {
    return this.renderers.has(type)
  }

  public getAllRenderers(): RendererDefinition[] {
    return Array.from(this.renderers.values())
  }
}

export const RendererRegistry = new RendererRegistryImpl()
export default RendererRegistry
