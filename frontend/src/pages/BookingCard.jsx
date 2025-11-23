// components/BookingCard.tsx

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { Armchair } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const BookingCard = ({ booking, event, index = 0 }) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const eventDate = new Date(event?.date);
  const today = new Date();

  let statusBadge = "Upcoming";
  let badgeColor = "bg-blue-100 text-blue-700";

  if (eventDate.toDateString() === today.toDateString()) {
    statusBadge = "Live";
    badgeColor = "bg-green-100 text-green-700";
  } else if (eventDate < today) {
    statusBadge = "Expired";
    badgeColor = "bg-red-100 text-red-700";
  }

  const seats = booking.seats || [];
  const hasSeats = Array.isArray(seats) && seats.length > 0;

  return (
    <>
      <motion.div
        key={booking.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="w-full"
      >
        <Card className="hover:shadow-xl transition-all duration-300 border-border/50 relative overflow-hidden h-full flex flex-col ">
          {/* Status Badge */}
          <span
            className={`absolute top-3 left-3 text-xs md:text-sm font-semibold px-3 py-1 rounded-full shadow-sm z-10 ${badgeColor}`}
          >
            {statusBadge}
          </span>

          {/* QR Code Button */}
          <Button
            onClick={() => setShowQRModal(true)}
            className="absolute top-3 right-3 text-xs md:text-sm px-3 py-1 h-auto rounded-md font-medium bg-primary text-white hover:bg-primary/90 transition-all shadow z-10"
          >
            Show QR
          </Button>

          <CardHeader className="pt-14 px-6 md:px-2 lg:px-6">
            <CardTitle className="text-md md:text-lg lg:text-xl font-semibold line-clamp-2">
              {event?.title || "Event"}
            </CardTitle>

            <CardDescription className="text-sm md:text-base text-muted-foreground">
              {event?.location || "Location"} •{" "}
              {event?.date ? new Date(event.date).toLocaleDateString() : ""}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-6 flex-1 flex flex-col px-6 md:px-2 lg:px-6">
            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/40">
                <span className="text-xs md:text-sm font-medium text-muted-foreground">Booking ID</span>
                <span className="text-xs md:text-sm font-semibold">{booking.id}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/40">
                <span className="text-xs md:text-sm font-medium text-muted-foreground">Seats</span>
                {hasSeats ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-auto p-1 text-xs md:text-sm font-semibold hover:bg-primary/10">
                        <Armchair className="w-4 h-4 mr-1 text-primary" />
                        {seats.length} seat{seats.length > 1 ? 's' : ''}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold mb-2">Seat Numbers:</p>
                        <div className="flex flex-wrap gap-2 max-w-xs">
                          {seats.map((seat, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                            >
                              Seat {seat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <span className="text-xs md:text-sm font-semibold text-muted-foreground">N/A</span>
                )}
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10">
                <span className="text-xs md:text-sm font-medium text-foreground">Total Amount</span>
                <span className="text-sm md:text-md  font-bold text-primary">
                  ₹{booking.totalAmount}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/40">
                <span className="text-xs md:text-sm font-medium text-muted-foreground">Ticket Status</span>
                <span
                  className={`text-xs md:text-xs font-semibold px-3 py-1 rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* QR Code Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Ticket QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 space-y-4">
            <div className="p-6 bg-muted/30 rounded-lg shadow-lg">
              <QRCodeSVG
                value={JSON.stringify({
                  bookingId: booking.id,
                  eventId: booking.eventId,
                  userId: booking.userId,
                })}
                size={250}
                className="mx-auto"
              />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-semibold">Booking ID: {booking.id}</p>
              <p className="text-xs text-muted-foreground">
                Scan this QR code at the event entry
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingCard;
