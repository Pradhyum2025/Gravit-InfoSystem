// ---------------------------------------------------------------------
// <copyright file="AppLayout.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/ui/sidebar'

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 w-full md:w-auto md:ml-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout

