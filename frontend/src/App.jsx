// ---------------------------------------------------------------------
// <copyright file="App.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import EventDetail from './pages/EventDetail'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import Bookings from './pages/Bookings'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageEvents from './pages/admin/ManageEvents'
import AdminBookings from './pages/admin/AdminBookings'

function App() {
  const dispatch = useDispatch()
  const { user, token } = useSelector((state) => state.user)

  useEffect(() => {
    // Initialize socket connection if user is logged in
    if (token && user) {
      // Socket initialization will be handled in components that need it
    }
  }, [token, user, dispatch])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/events/:id" element={<EventDetail />} />

      {/* User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute requireAdmin={true}>
            <ManageEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminBookings />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App


