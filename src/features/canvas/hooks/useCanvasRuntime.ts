import { useCanvasEngine } from '../components/CanvasEngineProvider'

export function useCanvasRuntime() {
  const { runtime } = useCanvasEngine()
  return runtime
}
