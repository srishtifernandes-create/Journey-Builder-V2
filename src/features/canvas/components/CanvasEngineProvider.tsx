import React, { createContext, ReactNode, useContext } from 'react'

export interface CanvasEngineContextType {
  isInitialized: boolean
}

const CanvasEngineContext = createContext<CanvasEngineContextType>({
  isInitialized: true,
})

export function CanvasEngineProvider({ children }: { children: ReactNode }) {
  return (
    <CanvasEngineContext.Provider value={{ isInitialized: true }}>
      {children}
    </CanvasEngineContext.Provider>
  )
}

export const useCanvasEngine = () => useContext(CanvasEngineContext)
