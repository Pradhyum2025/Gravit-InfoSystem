import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import UserMenu from './UserMenu'

export default function Navbar() {
    const { user } = useSelector((state) => state.user)
    const navigate = useNavigate()


    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-primary"
          >
            Event Booking
          </motion.h1>
          <div className="flex gap-3 items-center">
            {user ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <UserMenu />
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="rounded-full font-medium"
                  >
                    Login
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    onClick={() => navigate('/register')}
                    className="rounded-full px-6 py-2"
                  >
                    Sign up
                  </Button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </header>
    )
}