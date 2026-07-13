import type { INodeRegistry, NodeRegistration, NodeMetadata } from '../contracts/INodeRegistry'

class NodeRegistryImpl implements INodeRegistry {
  private registrations = new Map<string, NodeRegistration>()

  public registerNode(registration: NodeRegistration): void {
    if (this.registrations.has(registration.type)) {
      throw new Error(`Node type "${registration.type}" is already registered.`)
    }
    this.registrations.set(registration.type, registration)
  }

  public unregisterNode(type: string): void {
    this.registrations.delete(type)
  }

  public getNode(type: string): NodeRegistration | undefined {
    return this.registrations.get(type)
  }

  public getNodeMetadata(type: string): NodeMetadata | undefined {
    return this.registrations.get(type)?.metadata
  }

  public getAllNodes(): NodeRegistration[] {
    return Array.from(this.registrations.values())
  }

  public getNodesByCategory(category: 'flow' | 'logic' | 'integration' | 'lifecycle'): NodeRegistration[] {
    return this.getAllNodes().filter((n) => n.metadata.category === category)
  }

  public getNodesByGroup(group: string): NodeRegistration[] {
    return this.getAllNodes().filter((n) => n.metadata.group === group)
  }
}

export const NodeRegistry = new NodeRegistryImpl()
export default NodeRegistry
