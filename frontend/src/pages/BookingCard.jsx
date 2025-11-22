// components/BookingCard.tsx

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";




const  BookingCard = ({ booking, event, index = 0 }) =>{
  const [showQR, setShowQR] = useState(false);
  const eventDate = new Date(event?.date);
  const today = new Date();

  let statusBadge = "Upcoming";
  let badgeColor = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";

  if (eventDate.toDateString() === today.toDateString()) {
    statusBadge = "Live";
    badgeColor = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  } else if (eventDate < today) {
    statusBadge = "Expired";
    badgeColor = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }

  return (
    <motion.div
      key={booking.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="w-full"
    >
      <Card className="hover:shadow-xl transition-all duration-300 border-border/50 relative overflow-hidden">

        {/* ---- Status Badge ---- */}
        <span
          className={`absolute top-3 left-3 text-xs md:text-sm font-semibold px-3 py-1 rounded-full shadow-sm ${badgeColor}`}
        >
          {statusBadge}
        </span>

        {/* ---- Toggle Button ---- */}
        <button
          onClick={() => setShowQR((prev) => !prev)}
          className="
            absolute top-3 right-3 
            text-xs md:text-sm px-3 py-1 rounded-md font-medium
            bg-primary text-white hover:bg-primary/90
            transition-all shadow
          "
        >
          {showQR ? "Show Details" : "Show QR"}
        </button>

        <CardHeader className="pt-14">
          <CardTitle className="text-lg md:text-xl font-semibold">
            {event?.title || "Event"}
          </CardTitle>

          <CardDescription className="text-sm md:text-base text-muted-foreground">
            {event?.location || "Location"} •{" "}
            {event?.date ? new Date(event.date).toLocaleDateString() : ""}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-6">

          {/* ---- DETAILS ---- */}
          {!showQR && (
            <div className="space-y-4">

              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/40">
                <span className="text-xs md:text-sm font-medium text-muted-foreground">Booking ID</span>
                <span className="text-xs md:text-sm font-semibold">{booking.id}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/40">
                <span className="text-xs md:text-sm font-medium text-muted-foreground">Seats</span>
                <span className="text-xs md:text-sm font-semibold">
                  {booking.seats?.join(", ") || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10">
                <span className="text-xs md:text-sm font-medium text-foreground">Total Amount</span>
                <span className="text-lg md:text-xl font-bold text-primary">
                  ₹{booking.totalAmount}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/40">
                <span className="text-xs md:text-sm font-medium text-muted-foreground">Ticket Status</span>

                <span
                  className={`text-xs md:text-sm font-semibold px-3 py-1 rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

            </div>
          )}

          {/* ---- QR ---- */}
          {showQR && (
            <div className="pt-4 flex flex-col items-center">
              <div className="p-4 bg-muted/30 rounded-lg shadow">
                <QRCodeSVG
                  value={JSON.stringify({
                    bookingId: booking.id,
                    eventId: booking.eventId,
                    userId: booking.userId,
                  })}
                  size={180}
                  className="mb-2"
                />
              </div>

              <p className="text-xs md:text-sm text-muted-foreground mt-2">
                Scan this QR at entry
              </p>
            </div>
          )}

        </CardContent>
      </Card>
    </motion.div>
  );
}
export default  BookingCard;