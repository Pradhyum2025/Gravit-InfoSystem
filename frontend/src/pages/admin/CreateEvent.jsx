// ---------------------------------------------------------------------
// <copyright file="CreateEvent.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createEvent, updateEvent, fetchEventById } from '@/store/slices/eventsSlice'
import Sidebar from '@/components/ui/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

const CreateEvent = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('id')
  const { user } = useSelector((state) => state.user)
  const { selectedEvent } = useSelector((state) => state.events)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
    totalSeats: '',
    status: 'upcoming',
    image: '',
  })

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard', { replace: true })
      return
    }
    if (eventId) {
      dispatch(fetchEventById(eventId))
    }
  }, [dispatch, user, navigate, eventId])

  useEffect(() => {
    if (selectedEvent && eventId) {
      setFormData({
        title: selectedEvent.title || '',
        description: selectedEvent.description || '',
        date: selectedEvent.date ? new Date(selectedEvent.date).toISOString().split('T')[0] : '',
        location: selectedEvent.location || '',
        price: selectedEvent.price || '',
        totalSeats: selectedEvent.totalSeats || '',
        status: selectedEvent.status || 'upcoming',
        image: selectedEvent.image || '',
      })
    }
  }, [selectedEvent, eventId])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (eventId) {
        await dispatch(updateEvent({ id: eventId, data: formData })).unwrap()
      } else {
        await dispatch(createEvent(formData)).unwrap()
      }
      navigate('/admin/events')
    } catch (error) {
      alert(error || 'Failed to save event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/events')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-3xl">
              <CardHeader>
                <CardTitle>{eventId ? 'Edit Event' : 'Create New Event'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <Input
                        type="datetime-local"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (₹)
                      </label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Seats
                      </label>
                      <Input
                        type="number"
                        value={formData.totalSeats}
                        onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="closed">Closed</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="mt-2 w-48 h-48 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Saving...' : eventId ? 'Update Event' : 'Create Event'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CreateEvent


