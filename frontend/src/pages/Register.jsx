// ---------------------------------------------------------------------
// <copyright file="Register.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '@/store/slices/userSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector((state) => state.user)

  //For register roles by Pradhyum Garashya
  const tabs = [
    { label: "User", value: "user" },
    { label: "Admin", value: "admin" },
  ];

  useEffect(() => {
    if (user) {
      toast.success('Account created successfully!')
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(registerUser({ name, email, password, role }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-4xl font-bold text-primary">
              Create Account
            </CardTitle>
            <CardDescription className="text-base">
              Join us and start booking amazing events
            </CardDescription>
          </CardHeader>
          <CardContent>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* For register roles by Pradhyum Garashya */}
              <div className="space-y-2">
                <div className="w-full max-w-md mx-auto ">
                  <div className="flex justify-around gap-0  border-gray-300 w-full">

                    {tabs.map((tab) => (
                      <button
                     type='button'
                        key={tab.value}
                        onClick={() =>{
                          setRole(()=>tab.value)}
                          }
                        className={`
              pb-3 px-2 text-lg w-[100%] font-medium relative
              transition-all duration-200
              ${role === tab.value
                            ? "text-primary bg-gray-50"
                            : "text-gray-500 hover:text-primary"
                          }
            `}
                      >
                        {tab.label}

                        {/* Bottom line for active tab */}
                        {role === tab.value && (
                          <span
                            className="absolute left-0 bottom-0 w-full h-[3px] bg-primary rounded-full"
                          ></span>
                        )}
                      </button>
                    ))}
                  </div>

                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-foreground">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full"
                />
              </div>


              <Button type="submit" className="w-full mt-6" disabled={loading} size="lg">
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{' '}
                <a href="/login" className="text-primary hover:underline font-semibold transition-colors">
                  Sign In
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Register
