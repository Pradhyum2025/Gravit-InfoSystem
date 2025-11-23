// ---------------------------------------------------------------------
// <copyright file="Profile.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { User, Mail, Shield } from 'lucide-react'

const Profile = () => {
  const { user } = useSelector((state) => state.user)

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{user?.name}</CardTitle>
                <CardDescription className="text-base mb-3">{user?.email}</CardDescription>
                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <label className="block text-sm font-semibold text-muted-foreground mb-1">
                  Full Name
                </label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <p className="text-base font-medium text-foreground">{user?.name}</p>
                </div>
              </div>
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <label className="block text-sm font-semibold text-muted-foreground mb-1">
                  Email Address
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <p className="text-base font-medium text-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <label className="block text-sm font-semibold text-muted-foreground mb-1">
                  Role
                </label>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <p className="text-base font-medium text-foreground capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Profile
