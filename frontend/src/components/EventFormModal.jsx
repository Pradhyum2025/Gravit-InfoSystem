// ---------------------------------------------------------------------
// <copyright file="EventFormModal.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createEvent, updateEvent, fetchEventById } from '@/store/slices/eventsSlice'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const EventFormModal = ({ open, onOpenChange, eventId, onSuccess }) => {
    const dispatch = useDispatch()
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

    // Load event data when editing
    useEffect(() => {
        if (eventId && open) {
            dispatch(fetchEventById(eventId))
        }
    }, [dispatch, eventId, open])

    // Populate form when event data is loaded
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

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            setFormData({
                title: '',
                description: '',
                date: '',
                location: '',
                price: '',
                totalSeats: '',
                status: 'upcoming',
                image: '',
            })
        }
    }, [open])

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
            onOpenChange(false)
            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            alert(error || 'Failed to save event')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{eventId ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4 pb-2">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            className="min-h-[100px]"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="datetime-local"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalSeats">Total Seats</Label>
                            <Input
                                id="totalSeats"
                                type="number"
                                value={formData.totalSeats}
                                onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="live">Live</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="image">Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {formData.image && (
                            <img
                                src={formData.image}
                                alt="Preview"
                                className="mt-2 w-full sm:w-48 h-48 object-cover rounded-lg"
                            />
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4 sticky bottom-0 bg-background pb-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            {loading ? 'Saving...' : eventId ? 'Update Event' : 'Create Event'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EventFormModal
