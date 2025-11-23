// ---------------------------------------------------------------------
// <copyright file="Home.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// ---------------------------------------------------------------------

import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchEvents } from '@/store/slices/eventsSlice'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Calendar, MapPin, Ticket, ArrowRight, ChevronDown, Users, Star, Search, Filter } from 'lucide-react'
import Footer from '@/components/Footer'
import TalkToUs from '@/components/TalkToUs'
import BookingModal from '@/components/BookingModal'
import { toast } from 'sonner'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { events, loading } = useSelector((state) => state.events)
  const { user } = useSelector((state) => state.user)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLocation, setFilterLocation] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  const heroRef = useRef(null)
  const eventsRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })
  const eventsInView = useInView(eventsRef, { once: true, margin: "-100px" })

  useEffect(() => {
    dispatch(fetchEvents())
  }, [dispatch])

  const allEvents = events.filter(e => {
    const matchesSearch = !searchTerm || 
      e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !filterLocation || filterLocation === 'all' || 
      e.location?.toLowerCase() === filterLocation.toLowerCase()
    const matchesStatus = !filterStatus || filterStatus === 'all' || e.status === filterStatus
    const matchesDate = !filterDate || 
      new Date(e.date).toISOString().split('T')[0] === filterDate
    
    return matchesSearch && matchesLocation && matchesStatus && matchesDate
  })
  
  const uniqueLocations = [...new Set(events.map(e => e.location).filter(Boolean))]

  const handleBookTicket = (event) => {
    // Check if user is logged in
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/' } } })
      return
    }

    // Check if user is admin
    if (user.role === 'admin') {
      toast.error('Sign in as a user for booking')
      return
    }

    // Check if event is closed
    if (event.status === 'closed') {
      toast.error('This event is closed. Bookings are no longer available.')
      return
    }

    // Check if event has available seats
    if (event.availableSeats <= 0) {
      toast.error('This event is fully booked.')
      return
    }

    // All checks passed, open booking modal
    setSelectedEvent(event)
    setShowBookingModal(true)
  }

  const scrollToEvents = () => {
    document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">


      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16">
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight"
            >
              Discover amazing <br />
              <span className="text-primary">events near you</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light"
            >
              Book tickets for conferences, concerts, workshops, and more.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="pt-4"
            >
              <Button
                size="lg"
                className="text-lg px-10 py-5 rounded-full shadow-lg hover:shadow-xl transition-all bg-primary text-white hover:bg-primary/90"
                onClick={() => !user ? navigate('/register') : scrollToEvents()}
              >
                {!user ? 'Get started' : 'Explore events'}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-12 pt-12 text-sm text-gray-700"
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">10,000+ users</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">{events.length}+ events</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-medium">4.9 rating</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ delay: 1, duration: 0.8 }}
              className="pt-16"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex flex-col items-center gap-2 text-gray-500 cursor-pointer"
                onClick={scrollToEvents}
              >
                <span className="text-sm font-medium">Explore events</span>
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events-section" ref={eventsRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={eventsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                All Events
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                Discover experiences you'll love
              </p>
            </div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={eventsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterLocation || 'all'} onValueChange={(value) => setFilterLocation(value === 'all' ? 'all' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  placeholder="Filter by date"
                />
                <Select value={filterStatus || 'all'} onValueChange={(value) => setFilterStatus(value === 'all' ? 'all' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(searchTerm || (filterLocation && filterLocation !== 'all') || filterDate || (filterStatus && filterStatus !== 'all')) && (
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('')
                      setFilterLocation('all')
                      setFilterDate('')
                      setFilterStatus('all')
                    }}
                  >
                    Clear Filters
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {allEvents.length} event{allEvents.length !== 1 ? 's' : ''} found
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : allEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No events found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={eventsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className={`group relative h-full ${
                    event.status === 'closed' ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={() => {
                    if (event.status !== 'closed') {
                      handleBookTicket(event)
                    }
                  }}
                  whileHover={event.status !== 'closed' ? { scale: 1.03 } : {}}
                  whileTap={event.status !== 'closed' ? { scale: 0.97 } : {}}
                >
                  <div
                    className={`
          h-full flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 relative bg-white
          ${event.status === 'closed' ? 'opacity-60 pointer-events-none' : 'hover:shadow-2xl'}
          ${event.status === 'live' ? 'ring-2 ring-green-300' : ''}
        `}
                  >
                    {/* Image */}
                    {event.image && (
                      <div className="relative w-full h-72 overflow-hidden bg-gray-100">
                        <motion.img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        />
                        {/* Overlay */}
                        <motion.div
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"
                        />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div
                      className={`
            absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold
            ${event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : ''}
            ${event.status === 'live' ? 'bg-green-100 text-green-800 animate-pulse' : ''}
            ${event.status === 'closed' ? 'bg-red-100 text-red-800' : ''}
          `}
                    >
                      {event.status.toUpperCase()}
                    </div>

                    {/* Closed overlay */}
                    {event.status === 'closed' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold rounded-2xl">
                        Sold Out
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>

                        <div className="space-y-2 mb-3 text-gray-600 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(event.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      {/* Price & Seats */}
                      <motion.div
                        className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100"
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div>
                          <span className="text-sm text-gray-500">From </span>
                          <span className="text-xl font-semibold text-gray-900">
                            ₹{event.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Ticket className="w-4 h-4" />
                          <span>{event.availableSeats || 0} left</span>
                        </div>
                      </motion.div>

                      {/* Quick Action Button on hover */}
                      {event.status !== 'closed' && (event.availableSeats > 0) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 flex items-end justify-center p-6 bg-gradient-to-t from-black/40 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                        >
                          <Button
                            size="sm"
                            className="bg-primary text-white rounded-full px-5 py-2 shadow-lg hover:bg-primary/90"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleBookTicket(event)
                            }}
                          >
                            Book Now
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          )}

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 lg:px-8 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to explore?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands discovering and booking amazing events every day
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-10 py-5 rounded-full shadow-lg hover:shadow-xl transition-all bg-primary text-white hover:bg-primary/90"
                onClick={() => navigate('/register')}
              >
                Get started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-5 rounded-full border-2 hover:bg-gray-50 transition-all"
                onClick={() => navigate('/login')}
              >
                Sign in
              </Button>
            </div>
          )}
        </motion.div>
      </section>

      <TalkToUs />
      
      {/* Booking Modal */}
      {showBookingModal && selectedEvent && (
        <BookingModal
          event={selectedEvent}
          onClose={() => {
            setShowBookingModal(false)
            setSelectedEvent(null)
          }}
        />
      )}
    </div>
  )
}

export default Home
