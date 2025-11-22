// ---------------------------------------------------------------------
// <copyright file="SubHeader.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import EventFormModal from '@/components/EventFormModal'
import { useDispatch } from 'react-redux'
import { fetchEvents } from '@/store/slices/eventsSlice'

const SubHeader = () => {
  const location = useLocation()
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [modalOpen, setModalOpen] = useState(false)
  const navigate  = useNavigate();
  const path = location.pathname;
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
        showCreateButton: user?.role === 'admin'
      }
    } else if (path === '/dashboard/bookings') {
      return {
        title: user?.role === 'admin' ? 'All Bookings' : 'My Bookings',
        description: user?.role === 'admin'
          ? 'View and manage all bookings'
          : 'View your event bookings and tickets',
        showCreateButton: false
      }
    } else if (path === '/dashboard/profile') {
      return {
        title: 'Profile',
        description: 'View your account information',
        showCreateButton: false
      }
    } else if (path === '/dashboard/events') {
      return {
        title: 'Manage Events',
        description: 'Create, edit, and manage your events',
        showCreateButton: true
      }
    }
    
    return {
      title: 'Dashboard',
      description: '',
      showCreateButton: false
    }
  }

  const pageInfo = getPageInfo()

  return (
    <>
      <div className="flex stikcy w-full top-20 bg-red-50 items-center justify-between px-4 py-3 border-b bg-white/50 backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{pageInfo.title}</h2>
          {pageInfo.description && (
            <p className="text-sm text-muted-foreground mt-1">{pageInfo.description}</p>
          )}
        </div>
        {pageInfo.showCreateButton && (
          <Button onClick={handleCreateEvent} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Event
          </Button>
        )}
         {user?.role==="user" && path==="/dashboard" &&
       <Button onClick={() => navigate('/')}>
       Browse Events
     </Button>}
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




