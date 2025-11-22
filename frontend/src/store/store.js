// ---------------------------------------------------------------------
// <copyright file="store.js" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import eventsReducer from './slices/eventsSlice'
import bookingsReducer from './slices/bookingsSlice'
import socketReducer from './slices/socketSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventsReducer,
    bookings: bookingsReducer,
    socket: socketReducer,
  },
})


