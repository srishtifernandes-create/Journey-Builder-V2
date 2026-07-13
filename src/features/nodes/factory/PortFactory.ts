import type { IPortFactory } from '../contracts/INodeFactory'
import type { PortState } from '../contracts/INode'
import type { PortDefinition } from '../contracts/INodeRegistry'

export class PortFactoryImpl implements IPortFactory {
  public createPorts(definitions: PortDefinition[]): Record<string, PortState> {
    const ports: Record<string, PortState> = {}
    definitions.forEach((def) => {
      ports[def.id] = {
        id: def.id,
        type: def.type,
        connected: false,
        label: def.label,
      }
    })
    return ports
  }
}

export const PortFactory = new PortFactoryImpl()
export default PortFactory
