// ---------------------------------------------------------------------
// <copyright file="SeatLegend.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { Lock } from 'lucide-react'

const SeatLegend = () => {
  return (
    <div className="flex flex-wrap justify-around md:justify-center gap-3 sm:gap-4 mb-4 sm:mb-6 p-2 sm:p-4 bg-secondary/50 rounded-lg">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 sm:w-6 sm:h-6 bg-muted border-2 border-border rounded"></div>
        <span className="text-[.5rem] sm:text-sm text-muted-foreground">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 sm:w-6 sm:h-6 bg-primary border-2 border-primary rounded"></div>
        <span className="text-[.5rem] sm:text-sm text-muted-foreground">Selected</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 sm:w-6 sm:h-6 bg-red-600 border-2 border-red-800 rounded cursor-not-allowed relative overflow-hidden">
          <div className="absolute inset-0 bg-red-700/30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
          </div>
        </div>
        <span className="text-[.5rem] sm:text-sm text-red-600 font-semibold">Booked</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 sm:w-6 sm:h-6 bg-muted-foreground/20 border-2 border-muted-foreground/30 rounded"></div>
        <span className="text-[.5rem] sm:text-sm text-muted-foreground">Locked</span>
      </div>
    </div>
  )
}

export default SeatLegend

