import type { IRendererRegistry, RendererDefinition } from '../contracts/INodeRenderer'

class RendererRegistryImpl implements IRendererRegistry {
  private renderers = new Map<string, RendererDefinition>()

  public registerRenderer(definition: RendererDefinition): void {
    if (this.renderers.has(definition.type)) {
      throw new Error(`Renderer for type "${definition.type}" is already registered.`)
    }
    this.renderers.set(definition.type, definition)
  }

  public unregisterRenderer(type: string): void {
    this.renderers.delete(type)
  }

  public getRenderer(type: string): RendererDefinition | undefined {
    return this.renderers.get(type)
  }

  public getAllRenderers(): RendererDefinition[] {
    return Array.from(this.renderers.values())
  }
}

export const RendererRegistry = new RendererRegistryImpl()
export default RendererRegistry
