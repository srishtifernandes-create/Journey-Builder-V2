import React, { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'

const WorkspacePage = lazy(() => import('../pages/WorkspacePage'))
const NotFound = lazy(() => import('../pages/NotFound'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div className="p-4">Loading workspace...</div>}>
            <WorkspacePage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
])
