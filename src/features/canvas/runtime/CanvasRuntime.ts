import type { ICanvasRuntime } from './contracts/ICanvasRuntime'
import type { ICanvasAdapter, ViewportState } from './contracts/ICanvasAdapter'
import type { Position } from '../../nodes/contracts/INode'
import type { NodeCreationService } from '../../nodes/services/NodeCreationService'
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
  private nodeCreation: NodeCreationService | null = null
  private viewportCenterProvider: (() => { x: number; y: number }) | null = null
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

  public bindNodeCreation(service: NodeCreationService): void {
    this.nodeCreation = service
  }

  public createNode(type: string, position: Position): void {
    if (!this.nodeCreation) {
      throw new Error('Cannot create node: NodeCreationService is not bound to the canvas runtime.')
    }
    const node = this.nodeCreation.createNode(type, position)
    this.events.emit('nodeCreated', { nodeId: node.id, type: node.type })
  }

  public createNodeAtScreenPoint(type: string, screenX: number, screenY: number): void {
    const position = this.viewport.screenToFlowPosition(screenX, screenY)
    this.createNode(type, position)
  }

  public bindViewportCenterProvider(provider: () => { x: number; y: number }): void {
    this.viewportCenterProvider = provider
  }

  public createNodeAtViewportCenter(type: string): void {
    if (!this.viewportCenterProvider) {
      throw new Error('Cannot create node: viewport center provider is not bound to the canvas runtime.')
    }
    const { x, y } = this.viewportCenterProvider()
    this.createNodeAtScreenPoint(type, x, y)
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
