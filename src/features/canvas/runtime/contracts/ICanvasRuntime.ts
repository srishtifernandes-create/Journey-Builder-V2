import type { ICanvasAdapter } from './ICanvasAdapter'
import type { IViewportManager } from './IViewportManager'
import type { IInteractionManager } from './IInteractionManager'
import type { IKeyboardManager } from './IKeyboardManager'
import type { ISelectionManager } from './ISelectionManager'
import type { CanvasEvents } from '../CanvasEvents'
import type { NodeCreationService } from '../../../nodes/services/NodeCreationService'
import type { Position } from '../../../nodes/contracts/INode'

export interface ICanvasRuntime {
  readonly viewport: IViewportManager
  readonly interaction: IInteractionManager
  readonly keyboard: IKeyboardManager
  readonly selection: ISelectionManager
  readonly events: CanvasEvents

  bindAdapter(adapter: ICanvasAdapter): void
  bindNodeCreation(service: NodeCreationService): void
  bindViewportCenterProvider(provider: () => { x: number; y: number }): void
  createNode(type: string, position: Position): void
  createNodeAtScreenPoint(type: string, screenX: number, screenY: number): void
  createNodeAtViewportCenter(type: string): void
  dispose(): void
}
