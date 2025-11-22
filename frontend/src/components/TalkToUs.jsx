// ---------------------------------------------------------------------
// <copyright file="TalkToUs.jsx" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const TalkToUs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          className="bg-foreground text-white hover:bg-foreground/90 shadow-lg rounded-lg px-6 py-3"
          onClick={() => window.open('mailto:info@eventbooking.com', '_blank')}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Talk to us
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default TalkToUs


