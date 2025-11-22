// ---------------------------------------------------------------------
// <copyright file="BookingModal.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBooking } from '@/store/slices/bookingsSlice'
import { fetchEventById } from '@/store/slices/eventsSlice'
import { lockSeat, unlockSeat, setLockedSeats } from '@/store/slices/socketSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { X, CheckCircle2, Ticket } from 'lucide-react'
import { io } from 'socket.io-client'


const BookingModal = ({ event, onClose }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { socket, lockedSeats } = useSelector((state) => state.socket)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingData, setBookingData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let newSocket = socket
    if (!socket) {
      newSocket = io('http://localhost:5000')
      dispatch({ type: 'socket/setSocket', payload: newSocket })
      dispatch({ type: 'socket/setConnected', payload: true })
    }

    newSocket.emit('joinEvent', event.id)
    newSocket.on('lockedSeats', (seats) => {
      dispatch(setLockedSeats({ [event.id]: seats || {} }))
    })
    newSocket.on('seatLocked', ({ seatIndex, userId }) => {
      if (userId !== user?.id) {
        dispatch(lockSeat({ eventId: event.id, seatIndex, userId }))
      }
    })
    newSocket.on('seatUnlocked', ({ seatIndex }) => {
      dispatch(unlockSeat({ eventId: event.id, seatIndex }))
    })

    return () => {
      // Unlock all selected seats when modal closes
      if (newSocket && selectedSeats.length > 0) {
        selectedSeats.forEach(seatIndex => {
          newSocket.emit('unlockSeat', { eventId: event.id, seatIndex })
        })
      }
      if (!socket && newSocket) {
        newSocket.disconnect()
      }
    }
  }, [event.id, user?.id, dispatch, socket, selectedSeats])

  const totalSeats = event.totalSeats || 50
  const seatsPerRow = 10
  const rows = Math.ceil(totalSeats / seatsPerRow)
  const eventLockedSeats = lockedSeats[event.id] || {}

  const handleSeatClick = (seatIndex) => {
    if (eventLockedSeats[seatIndex] && eventLockedSeats[seatIndex] !== user?.id) {
      return // Seat is locked by another user
    }

    if (selectedSeats.includes(seatIndex)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatIndex))
      if (socket) {
        socket.emit('unlockSeat', { eventId: event.id, seatIndex })
      }
    } else {
      setSelectedSeats([...selectedSeats, seatIndex])
      if (socket) {
        socket.emit('lockSeat', { eventId: event.id, seatIndex, userId: user?.id })
      }
    }
  }

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat')
      return
    }

    setLoading(true)
    try {
      const result = await dispatch(
        createBooking({
          eventId: event.id,
          userId: user.id,
          seats: selectedSeats,
          totalAmount: selectedSeats.length * event.price,
        })
      ).unwrap()

      setBookingData(result)
      setBookingSuccess(true)
      // Unlock all seats after successful booking
      if (socket && selectedSeats.length > 0) {
        selectedSeats.forEach(seatIndex => {
          socket.emit('unlockSeat', { eventId: event.id, seatIndex })
        })
      }
      dispatch(fetchEventById(event.id))
    } catch (error) {
      alert(error || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  const getSeatStatus = (seatIndex) => {
    if (selectedSeats.includes(seatIndex)) return 'selected'
    if (eventLockedSeats[seatIndex]) return 'locked'
    return 'available'
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {!bookingSuccess ? (
            <>
              <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
                <div>
                  <CardTitle className="text-xl">Select Your Seats</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{event.title}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-secondary">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <CardContent className="p-6">
                <div className="mb-8">
                  <div className="flex flex-wrap gap-4 mb-6 p-4 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-muted border-2 border-border rounded"></div>
                      <span className="text-sm text-muted-foreground">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary border-2 border-primary rounded"></div>
                      <span className="text-sm text-muted-foreground">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-muted-foreground/20 border-2 border-muted-foreground/30 rounded"></div>
                      <span className="text-sm text-muted-foreground">Locked</span>
                    </div>
                  </div>

                  <div className="mb-4 text-center">
                    <div className="inline-block px-8 py-2 bg-secondary rounded-t-lg text-sm font-medium text-muted-foreground">
                      SCREEN
                    </div>
                  </div>

                  <div className="grid gap-2 justify-center" style={{ gridTemplateColumns: `repeat(${seatsPerRow}, 1fr)` }}>
                    {Array.from({ length: totalSeats }).map((_, index) => {
                      const status = getSeatStatus(index)
                      return (
                        <motion.button
                          key={index}
                          whileHover={status !== 'locked' ? { scale: 1.1 } : {}}
                          whileTap={status !== 'locked' ? { scale: 0.95 } : {}}
                          onClick={() => handleSeatClick(index)}
                          disabled={status === 'locked'}
                          className={`
                            w-10 h-10 rounded text-xs font-semibold transition-all duration-200
                            ${status === 'selected' ? 'bg-primary text-primary-foreground border-2 border-primary shadow-md' : ''}
                            ${status === 'available' ? 'bg-muted border-2 border-border hover:bg-secondary hover:border-primary/50' : ''}
                            ${status === 'locked' ? 'bg-muted-foreground/20 border-2 border-muted-foreground/30 cursor-not-allowed opacity-50' : ''}
                          `}
                        >
                          {index + 1}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-primary" />
                      <span className="font-medium">Selected Seats:</span>
                      <span className="font-bold text-primary">{selectedSeats.length}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">
                        ₹{selectedSeats.length * event.price}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-full text-lg font-semibold shadow-md hover:shadow-lg transition-all"
                    size="lg"
                    onClick={handleBooking}
                    disabled={selectedSeats.length === 0 || loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="space-y-6"
              >
                <div className="flex justify-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <CheckCircle2 className="w-16 h-16 text-primary" />
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">Booking Successful!</h2>
                  <p className="text-muted-foreground">Your tickets have been confirmed</p>
                </div>

                {bookingData && (
                  <div className="bg-secondary/50 p-6 rounded-lg inline-block">
                    <QRCodeSVG
                      value={JSON.stringify({
                        bookingId: bookingData.id,
                        eventId: event.id,
                        userId: user.id,
                      })}
                      size={200}
                      className="mx-auto mb-4"
                    />
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Booking ID</p>
                      <p className="font-mono font-semibold text-foreground">{bookingData.id}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button onClick={onClose} size="lg" className="min-w-[200px]">
                    Close
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default BookingModal

