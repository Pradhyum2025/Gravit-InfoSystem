// ---------------------------------------------------------------------
// <copyright file="SeatButton.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

const SeatButton = ({ 
  seatIndex, 
  seatNumber, 
  status, 
  isBooked, 
  onClick, 
  disabled 
}) => {
  return (
    <motion.button
      whileHover={status === 'available' ? { scale: 1.1 } : {}}
      whileTap={status === 'available' ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled || status === 'locked' || status === 'booked'}
      title={
        isBooked 
          ? `Seat ${seatNumber} is already booked` 
          : status === 'locked' 
            ? 'Seat is being selected by another user' 
            : status === 'selected' 
              ? 'Click to deselect' 
              : 'Click to select'
      }
      className={`
        w-8 h-8 sm:w-10 sm:h-10 rounded text-[10px] sm:text-xs font-semibold transition-all duration-200 relative overflow-hidden
        ${status === 'selected' ? 'bg-primary text-primary-foreground border-2 border-primary shadow-md hover:bg-primary/90' : ''}
        ${status === 'available' ? 'bg-muted border-2 border-border hover:bg-secondary hover:border-primary/50 cursor-pointer' : ''}
        ${status === 'locked' ? 'bg-muted-foreground/20 border-2 border-muted-foreground/30 cursor-not-allowed opacity-50' : ''}
        ${status === 'booked' ? 'bg-red-600 text-white border-2 border-red-800 cursor-not-allowed opacity-100 shadow-lg' : ''}
      `}
    >
      {isBooked ? (
        <>
          <div className="absolute inset-0 bg-red-700/30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
          <span className="relative text-[8px] sm:text-[10px] font-bold text-white/90 line-through opacity-0">
            {seatNumber}
          </span>
        </>
      ) : (
        <span>{seatNumber}</span>
      )}
    </motion.button>
  )
}

export default SeatButton

