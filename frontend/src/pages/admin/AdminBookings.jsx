// ---------------------------------------------------------------------
// <copyright file="AdminBookings.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchBookings, updateBooking } from '@/store/slices/bookingsSlice'
import { fetchEvents } from '@/store/slices/eventsSlice'
import Sidebar from '@/components/ui/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { motion } from 'framer-motion'

const AdminBookings = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)
  const { bookings, loading } = useSelector((state) => state.bookings)
  const { events } = useSelector((state) => state.events)

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard', { replace: true })
      return
    }
    dispatch(fetchBookings())
    dispatch(fetchEvents())
  }, [dispatch, user, navigate])

  const handleStatusUpdate = async (bookingId, newStatus) => {
    await dispatch(updateBooking({ id: bookingId, data: { status: newStatus } }))
    dispatch(fetchBookings())
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">All Bookings</h1>
          {loading ? (
            <p className="text-gray-500">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No bookings found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking, index) => {
                const event = events.find((e) => e.id === booking.eventId)
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">
                              {event?.title || 'Event'}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Booking ID:</span> {booking.id}
                              </div>
                              <div>
                                <span className="font-medium">Seats:</span> {booking.seats?.join(', ') || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Amount:</span> ₹{booking.totalAmount}
                              </div>
                              <div>
                                <span className="font-medium">Date:</span>{' '}
                                {new Date(booking.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Select
                              value={booking.status || 'pending'}
                              onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                              className="w-40"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminBookings


