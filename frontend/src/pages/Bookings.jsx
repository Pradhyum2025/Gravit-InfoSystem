// ---------------------------------------------------------------------
// <copyright file="Bookings.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { fetchBookings } from '@/store/slices/bookingsSlice'
import { fetchEvents } from '@/store/slices/eventsSlice'

const Bookings = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { bookings, loading } = useSelector((state) => state.bookings)
  const { events } = useSelector((state) => state.events)

  useEffect(() => {
    dispatch(fetchBookings({ userId: user?.id }))
    dispatch(fetchEvents())
  }, [dispatch, user?.id])

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">My Bookings</h1>
            <p className="text-muted-foreground mt-2">View and manage your event bookings</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : bookings.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground text-lg">No bookings found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((booking, index) => {
                const event = events.find((e) => e.id === booking.eventId)
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 border-border/50">
                      <CardHeader>
                        <CardTitle className="text-xl">{event?.title || 'Event'}</CardTitle>
                        <CardDescription className="text-base">
                          {event?.location} • {event?.date ? new Date(event.date).toLocaleDateString() : ''}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                            <span className="text-sm font-medium text-muted-foreground">Booking ID:</span>
                            <span className="text-sm font-semibold">{booking.id}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                            <span className="text-sm font-medium text-muted-foreground">Seats:</span>
                            <span className="text-sm font-semibold">{booking.seats?.join(', ') || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                            <span className="text-sm font-medium text-foreground">Total Amount:</span>
                            <span className="text-lg font-bold text-primary">₹{booking.totalAmount}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                            <span className="text-sm font-medium text-muted-foreground">Status:</span>
                            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                              {booking.status || 'pending'}
                            </span>
                          </div>
                          <div className="pt-4 border-t border-border/50">
                            <div className="flex flex-col items-center">
                              <div className="p-4 bg-muted/30 rounded-lg">
                                <QRCodeSVG
                                  value={JSON.stringify({
                                    bookingId: booking.id,
                                    eventId: booking.eventId,
                                    userId: booking.userId,
                                  })}
                                  size={150}
                                  className="mb-2"
                                />
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">Scan for entry</p>
                            </div>
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

export default Bookings


