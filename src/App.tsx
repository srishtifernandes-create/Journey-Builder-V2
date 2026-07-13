import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { AppProvider } from './app/providers/AppProvider'
import { ErrorBoundary } from './app/components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ErrorBoundary>
  )
}

export default App
