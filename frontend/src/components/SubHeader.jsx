// ---------------------------------------------------------------------
// <copyright file="SubHeader.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Plus, Calendar } from 'lucide-react'
import { useState } from 'react'
import EventFormModal from '@/components/EventFormModal'
import { useDispatch } from 'react-redux'
import { fetchEvents } from '@/store/slices/eventsSlice'

const SubHeader = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [modalOpen, setModalOpen] = useState(false)

  const handleCreateEvent = () => {
    setModalOpen(true)
  }

  const handleModalSuccess = () => {
    dispatch(fetchEvents())
  }

  // Determine the page title and content based on the route
  const getPageInfo = () => {
    const path = location.pathname
    
    if (path === '/dashboard') {
      return {
        title: `Welcome back, ${user?.name || 'User'}!`,
        description: user?.role === 'admin' 
          ? 'Manage your events and view analytics' 
          : 'View your upcoming events and bookings',
        showCreateButton: user?.role === 'admin',
        showBrowseButton: user?.role === 'user'
      }
    } else if (path === '/dashboard/bookings') {
      return {
        title: user?.role === 'admin' ? 'All Bookings' : 'My Bookings',
        description: user?.role === 'admin'
          ? 'View and manage all bookings'
          : 'View your event bookings and tickets',
        showCreateButton: false,
        showBrowseButton: user?.role === 'user'
      }
    } else if (path === '/dashboard/profile') {
      return {
        title: 'Profile',
        description: 'View your account information',
        showCreateButton: false,
        showBrowseButton: user?.role === 'user'
      }
    } else if (path === '/dashboard/events') {
      return {
        title: 'Manage Events',
        description: 'Create, edit, and manage your events',
        showCreateButton: true,
        showBrowseButton: false
      }
    }
    
    return {
      title: 'Dashboard',
      description: '',
      showCreateButton: false,
      showBrowseButton: false
    }
  }

  const pageInfo = getPageInfo()

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white/50 backdrop-blur-sm">
        <div>
          <h2 className="text-sm sm:text-xl font-semibold text-foreground">{pageInfo.title}</h2>
          {pageInfo.description && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{pageInfo.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {pageInfo.showBrowseButton && (
            <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className='hidden md:inline'>
              Browse
              </span>

              <span className='hidden lg:inline'>
              Events
              </span>

               
            </Button>
          )}
          {pageInfo.showCreateButton && (
            <Button title="Add New Event" onClick={handleCreateEvent} className="gap-2">
              <Plus className="w-4 h-4" />
              <span className='hidden md:inline'>
              Create Event
              </span>
            </Button>
          )}
        </div>
      </div>
      {pageInfo.showCreateButton && (
        <EventFormModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          eventId={null}
          onSuccess={handleModalSuccess}
        />
      )}
    </>
  )
}

export default SubHeader
