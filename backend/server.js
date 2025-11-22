// ---------------------------------------------------------------------
// <copyright file="server.js" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for Base64 images

// Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for now, restrict in production
        methods: ["GET", "POST"]
    }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Socket.IO Logic
const lockedSeats = {}; // { eventId: { seatIndex: userId } }

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinEvent', (eventId) => {
        socket.join(`event-${eventId}`);
        socket.emit('lockedSeats', lockedSeats[eventId] || {});
    });

    socket.on('lockSeat', ({ eventId, seatIndex, userId }) => {
        if (!lockedSeats[eventId]) lockedSeats[eventId] = {};
        if (!lockedSeats[eventId][seatIndex]) {
            lockedSeats[eventId][seatIndex] = userId;
            io.to(`event-${eventId}`).emit('seatLocked', { seatIndex, userId });
        }
    });

    socket.on('unlockSeat', ({ eventId, seatIndex }) => {
        if (lockedSeats[eventId] && lockedSeats[eventId][seatIndex]) {
            delete lockedSeats[eventId][seatIndex];
            io.to(`event-${eventId}`).emit('seatUnlocked', { seatIndex });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Optional: Unlock seats locked by this socket if tracking by socketId
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
// Test Database Connection
db.execute('SELECT 1')
    .then(() => {
        console.log('Database connected successfully');
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    });
