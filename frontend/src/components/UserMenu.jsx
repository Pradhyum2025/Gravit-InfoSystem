// ---------------------------------------------------------------------
// <copyright file="UserMenu.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/store/slices/userSlice'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { User } from 'lucide-react'

const UserMenu = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const handleDashboard = () => {
    navigate('/dashboard')
  }

  if (!user) {
    return null
  }

  return (
    <Menubar className="border-0 bg-transparent p-0 h-auto">
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer p-0 h-auto focus:bg-transparent data-[state=open]:bg-transparent hover:bg-transparent border-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-80 transition-opacity">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </MenubarTrigger>
        <MenubarContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <MenubarSeparator />
          <MenubarItem onClick={handleDashboard} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
            <span>Logout</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export default UserMenu

