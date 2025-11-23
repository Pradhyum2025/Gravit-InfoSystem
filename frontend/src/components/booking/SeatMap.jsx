// ---------------------------------------------------------------------
// <copyright file="SeatMap.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import SeatButton from './SeatButton'

const SeatMap = ({ 
  totalSeats, 
  seatsPerRow, 
  bookedSeats, 
  selectedSeats, 
  eventLockedSeats, 
  userId,
  onSeatClick 
}) => {
  const getSeatStatus = (seatIndex) => {
    const seatNumber = seatIndex + 1
    if (bookedSeats && bookedSeats.includes(seatNumber)) return 'booked'
    if (selectedSeats.includes(seatIndex)) return 'selected'
    if (eventLockedSeats[seatIndex] && eventLockedSeats[seatIndex] !== userId) return 'locked'
    return 'available'
  }

  return (
    <div className="w-full overflow-x-auto pb-5">
      <div className="mb-3 sm:mb-4 text-center">
        <div className="inline-block px-4 sm:px-8 py-1.5 sm:py-2 bg-secondary rounded-t-lg text-xs sm:text-sm font-medium text-muted-foreground">
          SCREEN
        </div>
      </div>

      <div 
        className="grid gap-1.5 sm:gap-2 justify-center place-items-center mx-auto w-full" 
        style={{ 
          gridTemplateColumns: `repeat(${seatsPerRow}, 1fr)`,
        //   maxWidth: '100%',
          width: 'fit-content'
        }}
      >
        {Array.from({ length: totalSeats }).map((_, index) => {
          const status = getSeatStatus(index)
          const seatNumber = index + 1
          const isBooked = bookedSeats && bookedSeats.length > 0 && bookedSeats.includes(seatNumber)
          
          return (
            <SeatButton
              key={index}
              seatIndex={index}
              seatNumber={seatNumber}
              status={status}
              isBooked={isBooked}
              onClick={() => onSeatClick(index)}
              disabled={status === 'locked' || status === 'booked'}
            />
          )
        })}
      </div>
    </div>
  )
}

export default SeatMap

