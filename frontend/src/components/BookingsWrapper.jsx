// ---------------------------------------------------------------------
// <copyright file="BookingsWrapper.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useSelector } from 'react-redux'
import Bookings from '@/pages/Bookings'
import AdminBookings from '@/pages/admin/AdminBookings'

const BookingsWrapper = () => {
  const { user } = useSelector((state) => state.user)
  
  if (user?.role === 'admin') {
    return <AdminBookings />
  }
  
  return <Bookings />
}

export default BookingsWrapper

