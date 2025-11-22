// ---------------------------------------------------------------------
// <copyright file="sidebar.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  User,
  Settings,
  LogOut,
  Home,
  Menu
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "@/store/slices/userSlice"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const SidebarContent = ({ location, handleLogout, className }) => {
  const { user } = useSelector((state) => state.user)
  const isAdmin = user?.role === 'admin'
  const userMenuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/dashboard/bookings", label: "My Bookings", icon: Ticket },
    { path: "/dashboard/profile", label: "Profile", icon: User },
  ]

  const adminMenuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/dashboard/events", label: "Manage Events", icon: Calendar },
    { path: "/dashboard/bookings", label: "Bookings", icon: Ticket },
  ]

  const menuItems = isAdmin ? adminMenuItems : userMenuItems

  return (
    <div className={cn("flex flex-col h-full bg-card text-card-foreground", className)}>
      <Link to={"/"} className="p-6 border-b">
        <h2 className="text-2xl font-bold text-primary tracking-tight">Event Booking</h2>
      </Link>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
            >
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 mb-1",
                  isActive && "bg-secondary text-secondary-foreground font-semibold"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t space-y-2">
        <Link to="/">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Home className="w-5 h-5" />
            Home
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}

const Sidebar = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)

  const handleLogout = () => {
    dispatch(logout())
    window.location.href = "/"
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r bg-card h-screen sticky top-0">
        <SidebarContent
          location={location}
          handleLogout={handleLogout}
        />
      </div>

      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent
              location={location}
              handleLogout={handleLogout}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export default Sidebar


