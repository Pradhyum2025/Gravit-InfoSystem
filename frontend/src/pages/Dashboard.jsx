// ---------------------------------------------------------------------
// <copyright file="Dashboard.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchBookings } from '@/store/slices/bookingsSlice'
import { fetchEvents } from '@/store/slices/eventsSlice'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Ticket, Calendar, TrendingUp, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)
  const { bookings } = useSelector((state) => state.bookings)
  const { events } = useSelector((state) => state.events)

  useEffect(() => {
    dispatch(fetchBookings({ userId: user?.id }))
    dispatch(fetchEvents())
  }, [dispatch, user?.id])

  const upcomingBookings = bookings.filter((booking) => {
    const event = events.find((e) => e.id === booking.eventId)
    return event && new Date(event.date) > new Date()
  })

  const totalSpent = bookings.reduce((sum, booking) => sum + parseFloat(booking.totalAmount || 0), 0)

  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: Ticket,
      description: "All time bookings",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Upcoming Events",
      value: upcomingBookings.length,
      icon: Calendar,
      description: "Events you're attending",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Total Spent",
      value: `₹${totalSpent}`,
      icon: TrendingUp,
      description: "Total investment",
      color: "text-green-500",
      bg: "bg-green-500/10"
    }
  ]

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex-1"
          >
            <Card className="hover:shadow-md transition-shadow duration-300 h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">{stat.title}</p>
                  <p className="text-lg font-bold truncate">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="col-span-1 lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your latest event bookings</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/bookings')}>
                View All
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 rounded-full bg-muted mb-4">
                    <Ticket className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No bookings yet</h3>
                  <p className="text-muted-foreground mb-4">Start exploring events to make your first booking.</p>
                  <Button onClick={() => navigate('/')}>Browse Events</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => {
                    const event = events.find((e) => e.id === booking.eventId)
                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{event?.title || 'Event'}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{booking.totalAmount}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.seats?.length || 0} seats
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
