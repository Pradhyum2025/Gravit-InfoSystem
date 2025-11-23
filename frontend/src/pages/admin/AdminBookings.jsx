// ---------------------------------------------------------------------
// <copyright file="AdminBookings.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchBookings, updateBooking } from '@/store/slices/bookingsSlice'
import { fetchEvents } from '@/store/slices/eventsSlice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { Armchair } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from 'sonner'

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
    try {
      await dispatch(updateBooking({ id: bookingId, data: { status: newStatus } })).unwrap()
      dispatch(fetchBookings())
      toast.success('Booking status updated successfully!')
    } catch (error) {
      toast.error(error || 'Failed to update booking status')
    }
  }

  return (
    <div className="w-full space-y-4">
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
            const seats = booking.seats || []
            const hasSeats = Array.isArray(seats) && seats.length > 0
            
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex-1 w-full">
                        <h3 className="text-lg font-semibold mb-2">
                          {event?.title || 'Event'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Booking ID:</span> {booking.id}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Seats:</span>
                            {hasSeats ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-auto p-1 hover:bg-primary/10">
                                    <Armchair className="w-4 h-4 mr-1 text-primary" />
                                    {seats.length} seat{seats.length > 1 ? 's' : ''}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-3">
                                  <div className="space-y-2">
                                    <p className="text-sm font-semibold mb-2">Seat Numbers:</p>
                                    <div className="flex flex-wrap gap-2 max-w-xs">
                                      {seats.map((seat, idx) => (
                                        <span
                                          key={idx}
                                          className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                                        >
                                          Seat {seat}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
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
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <Select
                          value={booking.status || 'pending'}
                          onValueChange={(value) => handleStatusUpdate(booking.id, value)}
                        >
                          <SelectTrigger className="w-full md:w-40">
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
  )
}

export default AdminBookings
