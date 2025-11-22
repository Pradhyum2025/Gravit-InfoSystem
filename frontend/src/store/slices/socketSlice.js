// ---------------------------------------------------------------------
// <copyright file="socketSlice.js" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { createSlice } from '@reduxjs/toolkit'

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket: null,
    lockedSeats: {},
    connected: false,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload
    },
    setConnected: (state, action) => {
      state.connected = action.payload
    },
    setLockedSeats: (state, action) => {
      state.lockedSeats = { ...state.lockedSeats, ...action.payload }
    },
    lockSeat: (state, action) => {
      const { eventId, seatIndex, userId } = action.payload
      if (!state.lockedSeats[eventId]) {
        state.lockedSeats[eventId] = {}
      }
      state.lockedSeats[eventId][seatIndex] = userId
    },
    unlockSeat: (state, action) => {
      const { eventId, seatIndex } = action.payload
      if (state.lockedSeats[eventId]) {
        delete state.lockedSeats[eventId][seatIndex]
      }
    },
  },
})

export const { setSocket, setConnected, setLockedSeats, lockSeat, unlockSeat } = socketSlice.actions
export default socketSlice.reducer

