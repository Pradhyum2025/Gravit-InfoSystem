// ---------------------------------------------------------------------
// <copyright file="Bookings.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { fetchBookings } from '@/store/slices/bookingsSlice'
import { fetchEvents } from '@/store/slices/eventsSlice'
import BookingCard from './BookingCard'

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
    <div className="w-full space-y-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
          {bookings.map((booking, index) => {
            const event = events.find((e) => e.id === booking.eventId)
            return (
              <BookingCard key={booking.id} event={event} booking={booking} index={index} />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Bookings
