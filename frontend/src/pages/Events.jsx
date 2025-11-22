// ---------------------------------------------------------------------
// <copyright file="Events.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchEvents } from '@/store/slices/eventsSlice'
import Sidebar from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Ticket } from 'lucide-react'


const Events = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { events, loading } = useSelector((state) => state.events)

  useEffect(() => {
    dispatch(fetchEvents())
  }, [dispatch])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 w-full md:w-auto md:ml-0 overflow-y-auto">
        <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">All Events</h1>
              <p className="text-muted-foreground mt-1">Discover and book tickets for upcoming events</p>
            </div>
            {/* Placeholder for search/filter if needed later */}
            {/* <div className="w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search events..." className="pl-8 w-full md:w-[300px]" />
              </div>
            </div> */}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-muted mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No events found</h3>
              <p className="text-muted-foreground">Check back later for new events.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 group border-border/50 hover:border-primary/30">
                    <div className="relative w-full h-48 bg-muted overflow-hidden">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary">
                          <Calendar className="w-12 h-12 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold shadow-sm">
                        {event.category || 'Event'}
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="line-clamp-1 text-xl">{event.title}</CardTitle>
                      </div>
                      <CardDescription className="flex items-center gap-2 mt-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="line-clamp-1">{event.location}</span>
                      </CardDescription>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        {new Date(event.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t bg-muted/5 p-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="text-lg font-bold text-primary">
                          ₹{event.price}
                        </span>
                      </div>
                      <Button
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="shadow-sm"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Events


