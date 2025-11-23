// ---------------------------------------------------------------------
// <copyright file="EventDetail.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEventById } from '@/store/slices/eventsSlice'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Ticket, ArrowLeft, Share2, Clock } from 'lucide-react'
import BookingModal from '@/components/BookingModal'
import Sidebar from '@/components/ui/sidebar'
import { toast } from 'sonner'

const EventDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { selectedEvent, loading } = useSelector((state) => state.events)
  const { user } = useSelector((state) => state.user)
  const [showBookingModal, setShowBookingModal] = useState(false)

  useEffect(() => {
    dispatch(fetchEventById(id))
  }, [dispatch, id])

  const handleBookTicket = () => {
    // Check if user is logged in
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } })
      return
    }

    // Check if user is admin
    if (user.role === 'admin') {
      toast.error('Sign in as a user for booking')
      return
    }

    // Check if event is closed
    if (selectedEvent.status === 'closed') {
      toast.error('This event is closed. Bookings are no longer available.')
      return
    }

    // Check if event has available seats
    if (!selectedEvent.availableSeats || selectedEvent.availableSeats <= 0) {
      toast.error('This event is fully booked.')
      return
    }

    // All checks passed, open booking modal
    setShowBookingModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!selectedEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-lg">Event not found</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 w-full md:w-auto md:ml-0 overflow-y-auto">
        <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/events')}
            className="mb-6 hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
              {selectedEvent.image ? (
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <Calendar className="w-20 h-20 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Button size="icon" variant="secondary" className="rounded-full shadow-md">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                    {selectedEvent.title}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {selectedEvent.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      {new Date(selectedEvent.date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader className="px-0">
                    <CardTitle className="text-xl">About this event</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedEvent.description}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-8 shadow-lg border-border/50">
                  <CardHeader>
                    <CardTitle>Booking Details</CardTitle>
                    <CardDescription>Secure your spot properly</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg">
                      <span className="text-muted-foreground">Price per ticket</span>
                      <span className="text-2xl font-bold text-primary">₹{selectedEvent.price}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Ticket className="w-4 h-4" />
                          Available Seats
                        </span>
                        <span className="font-medium">{selectedEvent.availableSeats || 0}</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all duration-500"
                          style={{ width: `${Math.min((selectedEvent.availableSeats / 100) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full text-lg font-semibold shadow-md hover:shadow-lg transition-all"
                      onClick={handleBookTicket}
                      disabled={
                        !selectedEvent.availableSeats || 
                        selectedEvent.availableSeats === 0 || 
                        selectedEvent.status === 'closed'
                      }
                    >
                      {selectedEvent.status === 'closed'
                        ? 'Event Closed'
                        : (!selectedEvent.availableSeats || selectedEvent.availableSeats === 0)
                          ? 'Sold Out'
                          : 'Book Tickets Now'}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Secure payment powered by Stripe
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>

        {showBookingModal && (
          <BookingModal
            event={selectedEvent}
            onClose={() => setShowBookingModal(false)}
          />
        )}
      </div>
    </div>
  )
}

export default EventDetail


