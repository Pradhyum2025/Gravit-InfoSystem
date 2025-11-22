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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'

const AdminBookings = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)
  const { bookings, loading } = useSelector((state) => state.bookings)
  const { events } = useSelector((state) => state.events)

  useEffect(() => {
    dispatch(fetchBookings())
    dispatch(fetchEvents())
  }, [dispatch])

  const handleStatusUpdate = async (bookingId, newStatus) => {
    await dispatch(updateBooking({ id: bookingId, data: { status: newStatus } }))
    dispatch(fetchBookings())
  }

  return (
    <div className="w-full space-y-8">
        <div className="">
        
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
                              onValueChange={(value) => handleStatusUpdate(booking.id, value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
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
  )
}

export default AdminBookings


