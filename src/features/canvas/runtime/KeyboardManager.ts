import type { IKeyboardManager } from './contracts/IKeyboardManager'
import type { CanvasEvents } from './CanvasEvents'

export class KeyboardManager implements IKeyboardManager {
  private events: CanvasEvents | null = null
  private target: HTMLElement | Window | null = null

  constructor(events: CanvasEvents) {
    this.events = events
  }

  public bind(element: HTMLElement | Window): void {
    this.unbind()
    this.target = element
    this.target.addEventListener('keydown', this.handleKeyDown as EventListener)
    this.target.addEventListener('keyup', this.handleKeyUp as EventListener)
  }

  public unbind(): void {
    if (this.target) {
      this.target.removeEventListener('keydown', this.handleKeyDown as EventListener)
      this.target.removeEventListener('keyup', this.handleKeyUp as EventListener)
      this.target = null
    }
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    // Prevent capturing events when typing inside text inputs, textareas, or select elements
    const activeEl = document.activeElement
    if (
      activeEl &&
      (activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.getAttribute('contenteditable') === 'true')
    ) {
      return
    }

    const isCtrlOrCmd = e.ctrlKey || e.metaKey

    if (e.key === 'Delete' || e.key === 'Backspace') {
      this.events?.emit('keydown', 'delete')
    } else if (e.key === 'Escape') {
      this.events?.emit('keydown', 'escape')
    } else if (e.key === ' ') {
      this.events?.emit('keydown', 'space_down')
    } else if (isCtrlOrCmd && e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
      this.events?.emit('keydown', 'redo')
    } else if (isCtrlOrCmd && (e.key === 'z' || e.key === 'Z')) {
      this.events?.emit('keydown', 'undo')
    } else if (isCtrlOrCmd && (e.key === 'c' || e.key === 'C')) {
      this.events?.emit('keydown', 'copy')
    } else if (isCtrlOrCmd && (e.key === 'v' || e.key === 'V')) {
      this.events?.emit('keydown', 'paste')
    }
  }

  private handleKeyUp = (e: KeyboardEvent): void => {
    if (e.key === ' ') {
      this.events?.emit('keydown', 'space_up')
    }
  }
}
