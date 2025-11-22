// ---------------------------------------------------------------------
// <copyright file="ManageEvents.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchEvents, deleteEvent } from '@/store/slices/eventsSlice'
import Sidebar from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2 } from 'lucide-react'
import EventFormModal from '@/components/EventFormModal'

const ManageEvents = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)
  const { events, loading } = useSelector((state) => state.events)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState(null)

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard', { replace: true })
      return
    }
    dispatch(fetchEvents())
  }, [dispatch, user, navigate])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await dispatch(deleteEvent(id))
      dispatch(fetchEvents())
    }
  }

  const handleAddEvent = () => {
    setSelectedEventId(null)
    setModalOpen(true)
  }

  const handleEditEvent = (id) => {
    setSelectedEventId(id)
    setModalOpen(true)
  }

  const handleModalSuccess = () => {
    dispatch(fetchEvents())
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Manage Events</h1>
            <Button onClick={handleAddEvent}>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading events...</p>
          ) : events.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">No events found</p>
                <Button onClick={handleAddEvent}>
                  Create Your First Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    {event.image && (
                      <div className="w-full h-48 bg-gray-200 overflow-hidden rounded-t-lg">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                      <CardDescription>{event.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{event.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-primary">₹{event.price}</span>
                        <span className="text-sm text-gray-500">
                          {event.availableSeats || 0} seats
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleEditEvent(event.id)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <EventFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        eventId={selectedEventId}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}

export default ManageEvents


