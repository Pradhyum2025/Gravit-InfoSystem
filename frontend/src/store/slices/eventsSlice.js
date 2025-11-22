// ---------------------------------------------------------------------
// <copyright file="eventsSlice.js" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { eventAPI } from '@/lib/api'

export const fetchEvents = createAsyncThunk(
  'events/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await eventAPI.getAll(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events')
    }
  }
)

export const fetchEventById = createAsyncThunk(
  'events/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await eventAPI.getById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch event')
    }
  }
)

export const createEvent = createAsyncThunk(
  'events/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await eventAPI.create(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create event')
    }
  }
)

export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await eventAPI.update(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update event')
    }
  }
)

export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (id, { rejectWithValue }) => {
    try {
      await eventAPI.delete(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete event')
    }
  }
)

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    selectedEvent: null,
    filters: {
      location: '',
      date: '',
      status: '',
    },
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedEvent = action.payload
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload)
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(e => e.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = action.payload
        }
        if (state.selectedEvent?.id === action.payload.id) {
          state.selectedEvent = action.payload
        }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(e => e.id !== action.payload)
      })
  },
})

export const { setFilters, clearSelectedEvent } = eventsSlice.actions
export default eventsSlice.reducer


