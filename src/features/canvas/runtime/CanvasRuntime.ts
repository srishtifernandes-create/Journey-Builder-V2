import type { ICanvasRuntime } from './contracts/ICanvasRuntime'
import type { ICanvasAdapter, ViewportState } from './contracts/ICanvasAdapter'
import { ViewportManager } from './ViewportManager'
import { InteractionManager } from './InteractionManager'
import { KeyboardManager } from './KeyboardManager'
import { SelectionManager } from './SelectionManager'
import { CanvasEvents } from './CanvasEvents'

export class CanvasRuntime implements ICanvasRuntime {
  public readonly viewport: ViewportManager
  public readonly interaction: InteractionManager
  public readonly keyboard: KeyboardManager
  public readonly selection: SelectionManager
  public readonly events: CanvasEvents

  private adapter: ICanvasAdapter | null = null
  private disposeList: Array<() => void> = []

  constructor() {
    this.events = new CanvasEvents()
    this.viewport = new ViewportManager()
    this.interaction = new InteractionManager()
    this.keyboard = new KeyboardManager(this.events)
    this.selection = new SelectionManager(this.events)
  }

  public bindAdapter(adapter: ICanvasAdapter): void {
    this.unbindAdapter()
    this.adapter = adapter

    // Inject adapter dependency to sub-managers
    this.viewport.setAdapter(this.adapter)
    this.selection.setAdapter(this.adapter)

    // Bind event hooks from adapter to CanvasEvents pipeline
    this.disposeList.push(
      this.adapter.onViewportChange((vp: ViewportState) => {
        this.events.emit('viewportChange', vp)
      })
    )

    this.disposeList.push(
      this.adapter.onPaneClick((e: MouseEvent) => {
        this.events.emit('canvasClick', e)
      })
    )

    this.disposeList.push(
      this.adapter.onPaneDoubleClick((e: MouseEvent) => {
        this.events.emit('canvasDoubleClick', e)
      })
    )

    this.disposeList.push(
      this.adapter.onPaneContextMenu((e: MouseEvent) => {
        this.events.emit('paneContextMenu', e)
      })
    )

    // Bind window/container keyboard event listeners
    this.keyboard.bind(window)
  }

  private unbindAdapter(): void {
    this.disposeList.forEach((dispose) => dispose())
    this.disposeList = []
    this.keyboard.unbind()
    this.adapter = null
  }

  public dispose(): void {
    this.unbindAdapter()
    this.events.clear()
  }
}
