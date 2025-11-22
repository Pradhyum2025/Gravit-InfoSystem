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
import { toast } from 'sonner'
import { ImageIcon, X } from 'lucide-react'

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
                date: selectedEvent.date ? new Date(selectedEvent.date).toISOString().slice(0, 16) : '',
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
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result })
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        setFormData({ ...formData, image: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (eventId) {
                await dispatch(updateEvent({ id: eventId, data: formData })).unwrap()
                toast.success('Event updated successfully!')
            } else {
                await dispatch(createEvent(formData)).unwrap()
                toast.success('Event created successfully!')
            }
            onOpenChange(false)
            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            toast.error(error || 'Failed to save event')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg">{eventId ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3 mt-2 pb-2">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            className="min-h-[80px] text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-sm">Date</Label>
                            <Input
                                id="date"
                                type="datetime-local"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                                className="text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-sm">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                                className="text-sm"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-sm">Price (₹)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                className="text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalSeats" className="text-sm">Total Seats</Label>
                            <Input
                                id="totalSeats"
                                type="number"
                                value={formData.totalSeats}
                                onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                                required
                                className="text-sm"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-sm">Status</Label>
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
                        <Label htmlFor="image" className="text-sm">Image</Label>
                        {!formData.image ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                <label htmlFor="image" className="cursor-pointer">
                                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground mb-1">Click to upload image</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                                </label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-48 sm:h-56 object-cover rounded-lg"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={handleRemoveImage}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 justify-end pt-3  bg-background pb-2">
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
