// ---------------------------------------------------------------------
// <copyright file="AdminDashboard.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchEvents } from '@/store/slices/eventsSlice'
import { fetchBookings } from '@/store/slices/bookingsSlice'
import Sidebar from '@/components/ui/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Calendar, Ticket, TrendingUp, Users } from 'lucide-react'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)
  const { events } = useSelector((state) => state.events)
  const { bookings } = useSelector((state) => state.bookings)

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard', { replace: true })
      return
    }
    dispatch(fetchEvents())
    dispatch(fetchBookings())
  }, [dispatch, user, navigate])

  const upcomingEvents = events.filter((e) => new Date(e.date) > new Date())
  const liveEvents = events.filter((e) => {
    const eventDate = new Date(e.date)
    const today = new Date()
    return eventDate.toDateString() === today.toDateString()
  })
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
                  <Calendar className="w-5 h-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{events.length}</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
                  <Ticket className="w-5 h-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{bookings.length}</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₹{totalRevenue}</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Upcoming Events</CardTitle>
                  <Users className="w-5 h-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{upcomingEvents.length}</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                {events.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 border-b border-gray-200 last:border-0"
                  >
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 border-b border-gray-200 last:border-0"
                  >
                    <div>
                      <h3 className="font-semibold">Booking #{booking.id}</h3>
                      <p className="text-sm text-gray-500">
                        {booking.seats?.length || 0} seats
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary">₹{booking.totalAmount}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard


