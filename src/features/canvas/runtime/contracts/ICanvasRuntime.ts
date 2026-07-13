import type { ICanvasAdapter } from './ICanvasAdapter'
import type { IViewportManager } from './IViewportManager'
import type { IInteractionManager } from './IInteractionManager'
import type { IKeyboardManager } from './IKeyboardManager'
import type { ISelectionManager } from './ISelectionManager'
import type { CanvasEvents } from '../CanvasEvents'

export interface ICanvasRuntime {
  readonly viewport: IViewportManager
  readonly interaction: IInteractionManager
  readonly keyboard: IKeyboardManager
  readonly selection: ISelectionManager
  readonly events: CanvasEvents

  bindAdapter(adapter: ICanvasAdapter): void
  dispose(): void
}
