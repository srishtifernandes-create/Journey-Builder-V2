import { useState, useEffect } from 'react'
import { useCanvasRuntime } from './useCanvasRuntime'
import { ViewportState } from '../runtime/contracts/ICanvasAdapter'

export function useViewport(): ViewportState {
  const runtime = useCanvasRuntime()
  const [viewport, setViewport] = useState<ViewportState>(() => runtime.viewport.viewport)

  useEffect(() => {
    // Initial sync
    setViewport(runtime.viewport.viewport)

    // Listen to changes in viewport via event pipeline
    const unsubscribe = runtime.events.on('viewportChange', (vp) => {
      setViewport(vp)
    })

    return () => {
      unsubscribe()
    }
  }, [runtime])

  return viewport
}
