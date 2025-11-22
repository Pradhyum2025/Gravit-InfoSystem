// ---------------------------------------------------------------------
// <copyright file="bookingsSlice.js" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { bookingAPI } from '@/lib/api'

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.create(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking')
    }
  }
)

export const fetchBookings = createAsyncThunk(
  'bookings/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.getAll(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings')
    }
  }
)

export const updateBooking = createAsyncThunk(
  'bookings/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.update(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update booking')
    }
  }
)

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false
        state.bookings.push(action.payload)
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          state.bookings[index] = action.payload
        }
      })
  },
})

export const { clearError } = bookingsSlice.actions
export default bookingsSlice.reducer


