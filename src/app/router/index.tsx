import React, { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'

const Home = lazy(() => import('../pages/Home'))
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
            <Home />
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
