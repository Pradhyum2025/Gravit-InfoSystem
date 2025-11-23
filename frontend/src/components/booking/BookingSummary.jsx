// ---------------------------------------------------------------------
// <copyright file="BookingSummary.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { Button } from '@/components/ui/button'
import { Ticket } from 'lucide-react'

const BookingSummary = ({ 
  selectedSeats, 
  eventPrice, 
  onConfirm, 
  loading 
}) => {
  return (
    <div className="border-t border-border pt-4 sm:pt-6 space-y-4">

    {/* SUMMARY CARD */}
    <div className="
      flex flex-col sm:flex-row
      justify-between sm:items-center
      items-start
      gap-4 sm:gap-6
      p-4 sm:p-5
      bg-secondary/50 
      rounded-lg
    ">
      {/* LEFT SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:gap-3">
        <div className='flex items-center gap-2'>
        <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          <span className="text-sm sm:text-base font-medium">Selected Seats:</span>
  
          <span className="text-lg sm:text-xl font-bold text-primary">
            {selectedSeats.length}
          </span>
            
        </div>
  
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
  
          {selectedSeats.length > 0 && (
            <span className="
              text-xs sm:text-sm text-muted-foreground 
              break-words sm:break-normal
              max-w-[250px] sm:max-w-none
            ">
              (Seats: {selectedSeats.map(s => s + 1).join(", ")})
            </span>
          )}
        </div>
      </div>
  
      {/* RIGHT SECTION */}
      <div className="w-full sm:w-auto text-left sm:text-right">
        <p className="text-xs sm:text-sm text-muted-foreground">Total Amount</p>
        <p className="text-xl sm:text-2xl font-bold text-primary">
          ₹{selectedSeats.length * eventPrice}
        </p>
      </div>
    </div>
  
    {/* CTA BUTTON */}
    <Button
      className="
        w-full 
        text-base sm:text-lg 
        font-semibold 
        shadow-md 
        hover:shadow-lg 
        py-3 sm:py-4
        transition-all
      "
      size="lg"
      onClick={onConfirm}
      disabled={selectedSeats.length === 0 || loading}
    >
      {loading ? (
        <>
          <div className="
            animate-spin 
            rounded-full 
            h-4 w-4 sm:h-5 sm:w-5 
            border-b-2 
            border-primary-foreground 
            mr-2
          "></div>
          Processing...
        </>
      ) : (
        "Confirm Booking"
      )}
    </Button>
  
  </div>
  
  )
}

export default BookingSummary

