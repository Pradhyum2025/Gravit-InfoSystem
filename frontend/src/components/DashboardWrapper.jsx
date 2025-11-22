// ---------------------------------------------------------------------
// <copyright file="DashboardWrapper.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useSelector } from 'react-redux'
import Dashboard from '@/pages/Dashboard'
import AdminDashboard from '@/pages/admin/AdminDashboard'

const DashboardWrapper = () => {
  const { user } = useSelector((state) => state.user)
  
  if (user?.role === 'admin') {
    return <AdminDashboard />
  }
  
  return <Dashboard />
}

export default DashboardWrapper

