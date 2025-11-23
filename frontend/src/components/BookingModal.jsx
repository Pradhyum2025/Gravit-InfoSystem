// ---------------------------------------------------------------------
// <copyright file="BookingModal.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBooking } from '@/store/slices/bookingsSlice'
import { fetchEventById } from '@/store/slices/eventsSlice'
import { fetchBookings } from '@/store/slices/bookingsSlice'
import { lockSeat, unlockSeat, setLockedSeats } from '@/store/slices/socketSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { io } from 'socket.io-client'
import { toast } from 'sonner'
import SeatLegend from './booking/SeatLegend'
import SeatMap from './booking/SeatMap'
import BookingSummary from './booking/BookingSummary'
import BookingSuccess from './booking/BookingSuccess'

const BookingModal = ({ event, onClose }) => {


  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { socket, lockedSeats } = useSelector((state) => state.socket)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingData, setBookingData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [bookedSeats, setBookedSeats] = useState([])

  const totalSeats = event?.totalSeats || 50
  // Responsive seats per row: 5 on mobile, 10 on larger screens
  const [seatsPerRow, setSeatsPerRow] = useState(10)

  useEffect(() => {
    const updateSeatsPerRow = () => {
      setSeatsPerRow(window.innerWidth < 640 ? 10 : 10)
    }
    
    updateSeatsPerRow()
    window.addEventListener('resize', updateSeatsPerRow)
    return () => window.removeEventListener('resize', updateSeatsPerRow)
  }, [])            

  // Fetch all bookings for this event to get booked seats
  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (!event?.id) {
        setBookedSeats([])
        return
      }
      
      try {
        const result = await dispatch(fetchBookings({ eventId: event.id })).unwrap()
        
        // Extract all booked seats from all bookings for this event
        const allBookedSeats = []
        
        if (Array.isArray(result) && result.length > 0) {
          result.forEach(booking => {
            // Handle both string and number eventId
            const bookingEventId = Number(booking.eventId || booking.event_id)
            const currentEventId = Number(event.id)
            
            // Match booking to current event
            if (bookingEventId === currentEventId) {
              // Handle seats - could be array, string (JSON), or null/undefined
              if (booking.seats) {
                let seats = []
                
                // If it's already an array, use it directly
                if (Array.isArray(booking.seats)) {
                  seats = booking.seats
                } 
                // If it's a string, try to parse it
                else if (typeof booking.seats === 'string') {
                  try {
                    // Try JSON parse first
                    const parsed = JSON.parse(booking.seats)
                    seats = Array.isArray(parsed) ? parsed : [parsed]
                  } catch (e) {
                    // If JSON parse fails, try comma-separated
                    seats = booking.seats.split(',').map(s => s.trim()).filter(Boolean)
                  }
                }
                
                // Convert all seats to numbers and validate
                seats.forEach(seat => {
                  const seatNum = Number(seat)
                  if (!isNaN(seatNum) && seatNum > 0 && seatNum <= totalSeats) {
                    allBookedSeats.push(seatNum)
                  }
                })
              }
            }
          })
        }
        
        // Remove duplicates and sort
        const uniqueBookedSeats = [...new Set(allBookedSeats)].sort((a, b) => a - b)
        setBookedSeats(uniqueBookedSeats)
      } catch (error) {
        console.error('Failed to fetch booked seats:', error)
        setBookedSeats([])
      }
    }
    
    if (event?.id && totalSeats > 0) {
      fetchBookedSeats()
      // Refresh booked seats every 3 seconds to catch real-time updates
      const interval = setInterval(fetchBookedSeats, 3000)
      return () => clearInterval(interval)
    } else {
      setBookedSeats([])
    }
  }, [dispatch, event?.id, totalSeats])

  useEffect(() => {
    if (!event?.id) return

    let newSocket = socket
    if (!socket) {
      try {
        newSocket = io('http://localhost:5000', {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
          timeout: 20000,
        })
        dispatch({ type: 'socket/setSocket', payload: newSocket })
        dispatch({ type: 'socket/setConnected', payload: true })
      } catch (error) {
        console.error('Failed to create socket connection:', error)
        return
      }
    }

    if (!newSocket) return

    try {
      // Wait for connection before joining event
      const setupSocketListeners = () => {
        newSocket.emit('joinEvent', event.id)
      }

      // If already connected, setup immediately
      if (newSocket.connected) {
        setupSocketListeners()
      } else {
        // Wait for connection
        newSocket.once('connect', setupSocketListeners)
      }
      
      newSocket.on('lockedSeats', (seats) => {
        try {
          dispatch(setLockedSeats({ [event.id]: seats || {} }))
        } catch (error) {
          console.error('Error handling lockedSeats:', error)
        }
      })
      
      newSocket.on('seatLocked', ({ seatIndex, userId }) => {
        try {
          if (userId !== user?.id) {
            dispatch(lockSeat({ eventId: event.id, seatIndex, userId }))
          }
        } catch (error) {
          console.error('Error handling seatLocked:', error)
        }
      })
      
      newSocket.on('seatUnlocked', ({ seatIndex }) => {
        try {
          dispatch(unlockSeat({ eventId: event.id, seatIndex }))
        } catch (error) {
          console.error('Error handling seatUnlocked:', error)
        }
      })
      
      newSocket.on('seatLockFailed', ({ seatIndex, reason }) => {
        try {
          toast.error(`Seat ${seatIndex + 1} ${reason}`)
          // Remove from selected if it was selected
          setSelectedSeats(prev => prev.filter(s => s !== seatIndex))
        } catch (error) {
          console.error('Error handling seatLockFailed:', error)
        }
      })

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
      })

      newSocket.on('error', (error) => {
        console.error('Socket error:', error)
      })
    } catch (error) {
      console.error('Error setting up socket listeners:', error)
    }

    return () => {
      // Unlock all selected seats when modal closes
      if (newSocket && selectedSeats.length > 0) {
        try {
          selectedSeats.forEach(seatIndex => {
            newSocket.emit('unlockSeat', { eventId: event.id, seatIndex, userId: user?.id })
          })
        } catch (error) {
          console.error('Error unlocking seats on cleanup:', error)
        }
      }
      // Remove socket listeners
      try {
        if (newSocket) {
          newSocket.off('lockedSeats')
          newSocket.off('seatLocked')
          newSocket.off('seatUnlocked')
          newSocket.off('seatLockFailed')
          newSocket.off('connect_error')
          newSocket.off('error')
        }
        if (!socket && newSocket) {
          newSocket.disconnect()
        }
      } catch (error) {
        console.error('Error cleaning up socket:', error)
      }
    }
  }, [event?.id, user?.id, dispatch, socket, selectedSeats])

  const eventLockedSeats = lockedSeats[event.id] || {}

  const handleSeatClick = (seatIndex) => {
    if (!event?.id || !user?.id) {
      toast.error('Please login to select seats')
      return
    }

    const seatNumber = seatIndex + 1
    
    // Check if seat is already booked (validated from backend)
    if (bookedSeats.includes(seatNumber)) {
      toast.error(`Seat ${seatNumber} is already booked`)
      return
    }

    // Check if seat is locked by another user (temporary lock)
    if (eventLockedSeats[seatIndex] && eventLockedSeats[seatIndex] !== user?.id) {
      toast.error('This seat is being selected by another user')
      return
    }

    try {
      if (selectedSeats.includes(seatIndex)) {
        // Unlock seat
        setSelectedSeats(selectedSeats.filter((s) => s !== seatIndex))
        if (socket) {
          // Socket.io will queue the message if not connected yet
          socket.emit('unlockSeat', { eventId: event.id, seatIndex, userId: user?.id })
        }
      } else {
        // Lock seat temporarily (expires after 5 minutes)
        setSelectedSeats([...selectedSeats, seatIndex])
        if (socket) {
          // Socket.io will queue the message if not connected yet
          socket.emit('lockSeat', { eventId: event.id, seatIndex, userId: user?.id })
        }
      }
    } catch (error) {
      console.error('Error handling seat click:', error)
      toast.error('An error occurred. Please try again.')
    }
  }

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat')
      return
    }

    // Convert seat indices to seat numbers (1-based)
    const seatNumbers = selectedSeats.map(index => index + 1)
    
    // Final validation before submission - check if seats are already booked
    const conflictingSeats = seatNumbers.filter(seatNum => bookedSeats.includes(seatNum))
    if (conflictingSeats.length > 0) {
      toast.error(`Seats ${conflictingSeats.join(', ')} are already booked. Please select different seats.`)
      // Unlock conflicting seats and remove from selection
      conflictingSeats.forEach(seatNum => {
        const seatIndex = seatNum - 1
        setSelectedSeats(prev => prev.filter(s => s !== seatIndex))
        if (socket) {
          socket.emit('unlockSeat', { eventId: event.id, seatIndex, userId: user?.id })
        }
      })
      // Refresh booked seats
      const result = await dispatch(fetchBookings({ eventId: event.id })).unwrap()
      const refreshedBookedSeats = []
      
      if (Array.isArray(result)) {
        result.forEach(booking => {
          const bookingEventId = Number(booking.eventId || booking.event_id)
          const currentEventId = Number(event.id)
          
          if (bookingEventId === currentEventId && booking.seats) {
            let seats = []
            if (Array.isArray(booking.seats)) {
              seats = booking.seats
            } else if (typeof booking.seats === 'string') {
              try {
                const parsed = JSON.parse(booking.seats)
                seats = Array.isArray(parsed) ? parsed : [parsed]
              } catch (e) {
                seats = booking.seats.split(',').map(s => s.trim()).filter(Boolean)
              }
            }
            
            seats.forEach(seat => {
              const seatNum = Number(seat)
              if (!isNaN(seatNum) && seatNum > 0 && seatNum <= totalSeats) {
                refreshedBookedSeats.push(seatNum)
              }
            })
          }
        })
      }
      
      const uniqueRefreshedSeats = [...new Set(refreshedBookedSeats)].sort((a, b) => a - b)
      setBookedSeats(uniqueRefreshedSeats)
      return
    }

    if (!user?.id) {
      toast.error('Please login to make a booking')
      return
    }

    if (!event?.id || !event?.price) {
      toast.error('Invalid event information')
      return
    }

    setLoading(true)
    try {
      // BACKEND VALIDATES AND CONFIRMS BOOKING - Only backend modifies seat count
      const result = await dispatch(
        createBooking({
          eventId: event.id,
          userId: user.id,
          seats: seatNumbers, // Send seat numbers, not indices
          totalAmount: selectedSeats.length * event.price,
        })
      ).unwrap()

      // Booking confirmed by backend
      setBookingData(result)
      setBookingSuccess(true)
      toast.success('Booking confirmed successfully!')
      
      // Clear selected seats
      const bookedSeatIndices = [...selectedSeats]
      setSelectedSeats([])
      
      // Unlock all seats after successful booking
      if (socket && bookedSeatIndices.length > 0) {
        bookedSeatIndices.forEach(seatIndex => {
          socket.emit('unlockSeat', { eventId: event.id, seatIndex, userId: user?.id })
        })
      }
      
      // Refresh booked seats from backend immediately (with error handling)
      try {
        const updatedBookings = await dispatch(fetchBookings({ eventId: event.id })).unwrap()
        const allBookedSeats = []
        
        if (Array.isArray(updatedBookings)) {
          updatedBookings.forEach(booking => {
            const bookingEventId = Number(booking.eventId || booking.event_id)
            const currentEventId = Number(event.id)
            
            if (bookingEventId === currentEventId && booking.seats) {
              let seats = []
              if (Array.isArray(booking.seats)) {
                seats = booking.seats
              } else if (typeof booking.seats === 'string') {
                try {
                  const parsed = JSON.parse(booking.seats)
                  seats = Array.isArray(parsed) ? parsed : [parsed]
                } catch (e) {
                  seats = booking.seats.split(',').map(s => s.trim()).filter(Boolean)
                }
              }
              
              seats.forEach(seat => {
                const seatNum = Number(seat)
                if (!isNaN(seatNum) && seatNum > 0 && seatNum <= totalSeats) {
                  allBookedSeats.push(seatNum)
                }
              })
            }
          })
        }
        
        const uniqueBookedSeats = [...new Set(allBookedSeats)].sort((a, b) => a - b)
        setBookedSeats(uniqueBookedSeats)
      } catch (refreshError) {
        console.error('Error refreshing booked seats:', refreshError)
        // Don't fail the booking if refresh fails - booking was successful
      }
      
      // Refresh event data (backend modified seat count) - with error handling
      try {
        await dispatch(fetchEventById(event.id))
      } catch (refreshError) {
        console.error('Error refreshing event data:', refreshError)
        // Don't fail the booking if refresh fails
      }
    } catch (error) {
      console.error('Booking error:', error)
      const errorMessage = error?.message || error || 'Booking failed. Please try again.'
      toast.error(errorMessage)
      
      // Unlock seats on booking failure
      if (socket && selectedSeats.length > 0) {
        try {
          selectedSeats.forEach(seatIndex => {
            socket.emit('unlockSeat', { eventId: event.id, seatIndex, userId: user?.id })
          })
        } catch (unlockError) {
          console.error('Error unlocking seats:', unlockError)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  // Check if event is fully booked
  const isFullyBooked = event.availableSeats <= 0

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4" 
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {!bookingSuccess ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-border sticky top-0 bg-card z-10">
                <div className="flex-1 min-w-0 pr-2">
                  <CardTitle className="text-lg sm:text-xl truncate">Select Your Seats</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">{event.title}</p>
                  {isFullyBooked && (
                    <p className="text-xs sm:text-sm text-red-500 font-semibold mt-1">
                      ⚠️ Event is fully booked. Registration is closed.
                    </p>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose} 
                  className="hover:bg-secondary flex-shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>

              {/* Content */}
              <CardContent className="p-3 sm:p-4 md:p-6">
                {isFullyBooked ? (
                  <div className="text-center py-8 sm:py-12">
                    <p className="text-base sm:text-lg font-semibold text-red-500 mb-2">
                      All seats are booked
                    </p>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      This event is no longer accepting new bookings.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 sm:mb-8 w-full">
                      <SeatLegend />
                      <SeatMap
                        totalSeats={totalSeats}
                        seatsPerRow={seatsPerRow}
                        bookedSeats={bookedSeats}
                        selectedSeats={selectedSeats}
                        eventLockedSeats={eventLockedSeats}
                        userId={user?.id}
                        onSeatClick={handleSeatClick}
                      />
                    </div>

                    <BookingSummary
                      selectedSeats={selectedSeats}
                      eventPrice={event.price}
                      onConfirm={handleBooking}
                      loading={loading}
                    />
                  </>
                )}
              </CardContent>
            </>
          ) : (
            <BookingSuccess
              bookingData={bookingData}
              eventId={event.id}
              userId={user?.id}
              onClose={onClose}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default BookingModal
