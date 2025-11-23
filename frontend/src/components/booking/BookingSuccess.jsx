// ---------------------------------------------------------------------
// <copyright file="BookingSuccess.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const BookingSuccess = ({ bookingData, eventId, userId, onClose }) => {
  const [qrSize, setQrSize] = useState(200)

  useEffect(() => {
    const updateQrSize = () => {
      setQrSize(window.innerWidth < 640 ? 150 : 200)
    }
    
    updateQrSize()
    window.addEventListener('resize', updateQrSize)
    return () => window.removeEventListener('resize', updateQrSize)
  }, [])

  return (
    <div className="p-4 sm:p-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="space-y-4 sm:space-y-6"
      >
        <div className="flex justify-center">
          <div className="p-3 sm:p-4 bg-primary/10 rounded-full">
            <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Booking Successful!</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Your tickets have been confirmed</p>
        </div>

        {bookingData && (
          <div className="bg-secondary/50 p-4 sm:p-6 rounded-lg inline-block max-w-full sm:max-w-md mx-auto">
            <QRCodeSVG
              value={JSON.stringify({
                bookingId: bookingData.id,
                eventId: eventId,
                userId: userId,
              })}
              size={qrSize}
              className="mx-auto mb-4"
            />
            <div className="space-y-2 sm:space-y-3 text-center">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Booking ID</p>
                <p className="text-sm sm:text-base font-mono font-semibold text-foreground break-all">
                  {bookingData.id}
                </p>
              </div>
              {bookingData.seats && Array.isArray(bookingData.seats) && bookingData.seats.length > 0 && (
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">Your Seats</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {bookingData.seats.map((seat, idx) => (
                      <span
                        key={idx}
                        className="px-2 sm:px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs sm:text-sm font-semibold"
                      >
                        Seat {seat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-2 sm:pt-4">
          <Button onClick={onClose} size="lg" className="min-w-[150px] sm:min-w-[200px]">
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default BookingSuccess

