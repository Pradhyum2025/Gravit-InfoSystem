// ---------------------------------------------------------------------
// <copyright file="Footer.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { motion } from 'framer-motion'
import { MapPin, Mail, Phone, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Event Booking</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Your trusted platform for discovering and booking amazing events. 
              Experience seamless ticket booking with real-time seat selection.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/events" className="text-white/80 hover:text-white transition-colors">
                  Browse Events
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-white/80 hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/bookings" className="text-white/80 hover:text-white transition-colors">
                  My Bookings
                </a>
              </li>
              <li>
                <a href="/profile" className="text-white/80 hover:text-white transition-colors">
                  Profile
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4" />
                <span>123 Event Street, City, State 12345</span>
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@eventbooking.com" className="hover:text-white transition-colors">
                  info@eventbooking.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <Phone className="w-4 h-4" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="text-white/60 text-xs mt-2">
                Timings: Monday to Friday, 10 AM to 8 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/20">
          <div className="flex gap-4 mb-4 md:mb-0">
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </motion.a>
          </div>
          
          <div className="text-sm text-white/60 text-center md:text-right">
            <p>© {new Date().getFullYear()} Event Booking System. All Rights Reserved.</p>
            <p className="mt-1">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              {' | '}
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


