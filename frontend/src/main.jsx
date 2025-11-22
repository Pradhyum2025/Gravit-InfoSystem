// ---------------------------------------------------------------------
// <copyright file="main.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import './index.css'

// Components
import App from './App'
import AppLayout from './components/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardWrapper from './components/DashboardWrapper'
import BookingsWrapper from './components/BookingsWrapper'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ManageEvents from './pages/admin/ManageEvents'

// Router Configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <AppLayout />,
    children: [
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <DashboardWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/bookings',
        element: (
          <ProtectedRoute>
            <BookingsWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/events',
        element: (
          <ProtectedRoute requireAdmin={true}>
            <ManageEvents />
          </ProtectedRoute>
        ),
      },
    ],
  },
])

// Render App
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
