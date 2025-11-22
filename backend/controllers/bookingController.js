// ---------------------------------------------------------------------
// <copyright file="bookingController.js" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

const db = require('../config/db');

exports.createBooking = async (req, res) => {
    // Support both camelCase (frontend) and snake_case
    const { eventId, event_id, userId, user_id, seats, quantity, totalAmount, total_amount, name, email, mobile } = req.body;
    const event_id_val = eventId || event_id;
    const user_id_val = userId || user_id;
    const quantity_val = quantity || (seats ? seats.length : 0);
    const total_amount_val = totalAmount || total_amount;

    if (!event_id_val || !user_id_val || !quantity_val) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Check availability
        const [events] = await connection.query('SELECT * FROM events WHERE id = ? FOR UPDATE', [event_id_val]);
        if (events.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Event not found' });
        }
        const event = events[0];

        if (event.available_seats < quantity_val) {
            await connection.rollback();
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        // Update seats
        await connection.query('UPDATE events SET available_seats = available_seats - ? WHERE id = ?', [quantity_val, event_id_val]);

        // Create booking - store seats as JSON string (if column exists)
        const seatsJson = seats ? JSON.stringify(seats) : null;
        // Try with seats column, fallback to without if column doesn't exist
        let result;
        try {
            [result] = await connection.query(
                'INSERT INTO bookings (event_id, user_id, name, email, mobile, quantity, total_amount, seats) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [event_id_val, user_id_val, name, email, mobile, quantity_val, total_amount_val, seatsJson]
            );
        } catch (err) {
            // If seats column doesn't exist, insert without it
            [result] = await connection.query(
                'INSERT INTO bookings (event_id, user_id, name, email, mobile, quantity, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [event_id_val, user_id_val, name, email, mobile, quantity_val, total_amount_val]
            );
        }

        await connection.commit();

        // Get user info for response
        const [users] = await connection.query('SELECT name, email FROM users WHERE id = ?', [user_id_val]);
        const user = users[0] || {};

        // Return booking in camelCase
        const booking = {
            id: result.insertId,
            eventId: event_id_val,
            userId: user_id_val,
            seats: seats || [],
            quantity: quantity_val,
            totalAmount: total_amount_val,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            name: name || user.name,
            email: email || user.email
        };

        res.status(201).json(booking);
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const { userId } = req.query;
        let query = 'SELECT b.*, e.title, e.date, e.location, e.img FROM bookings b JOIN events e ON b.event_id = e.id';
        const params = [];
        
        if (userId) {
            query += ' WHERE b.user_id = ?';
            params.push(userId);
        }
        
        query += ' ORDER BY b.booking_date DESC';
        
        const [bookings] = await db.query(query, params);
        
        // Transform to camelCase
        const transformed = bookings.map(booking => {
            let seatsArray = [];
            try {
                seatsArray = booking.seats ? (typeof booking.seats === 'string' ? JSON.parse(booking.seats) : booking.seats) : [];
            } catch (e) {
                seatsArray = [];
            }
            return {
                id: booking.id,
                eventId: booking.event_id,
                userId: booking.user_id,
                seats: seatsArray,
                quantity: booking.quantity,
                totalAmount: booking.total_amount,
                status: booking.status || 'pending',
                createdAt: booking.booking_date || booking.created_at,
                name: booking.name,
                email: booking.email,
                mobile: booking.mobile
            };
        });
        
        res.json(transformed);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserBookings = async (req, res) => {
    const { userId } = req.params;
    try {
        const [bookings] = await db.query(
            'SELECT b.*, e.title, e.date, e.location, e.img FROM bookings b JOIN events e ON b.event_id = e.id WHERE b.user_id = ? ORDER BY b.booking_date DESC',
            [userId]
        );
        
        // Transform to camelCase
        const transformed = bookings.map(booking => {
            let seatsArray = [];
            try {
                seatsArray = booking.seats ? (typeof booking.seats === 'string' ? JSON.parse(booking.seats) : booking.seats) : [];
            } catch (e) {
                seatsArray = [];
            }
            return {
                id: booking.id,
                eventId: booking.event_id,
                userId: booking.user_id,
                seats: seatsArray,
                quantity: booking.quantity,
                totalAmount: booking.total_amount,
                status: booking.status || 'pending',
                createdAt: booking.booking_date || booking.created_at,
                name: booking.name,
                email: booking.email,
                mobile: booking.mobile
            };
        });
        
        res.json(transformed);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getBookingById = async (req, res) => {
    const { id } = req.params;
    try {
        const [bookings] = await db.query(
            'SELECT b.*, e.title, e.date, e.location, e.img FROM bookings b JOIN events e ON b.event_id = e.id WHERE b.id = ?',
            [id]
        );
        
        if (bookings.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        const booking = bookings[0];
        let seatsArray = [];
        try {
            seatsArray = booking.seats ? (typeof booking.seats === 'string' ? JSON.parse(booking.seats) : booking.seats) : [];
        } catch (e) {
            seatsArray = [];
        }
        
        res.json({
            id: booking.id,
            eventId: booking.event_id,
            userId: booking.user_id,
            seats: seatsArray,
            quantity: booking.quantity,
            totalAmount: booking.total_amount,
            status: booking.status || 'pending',
            createdAt: booking.booking_date || booking.created_at,
            name: booking.name,
            email: booking.email,
            mobile: booking.mobile
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateBooking = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    try {
        await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
        const [bookings] = await db.query('SELECT b.*, e.title, e.date, e.location, e.img FROM bookings b JOIN events e ON b.event_id = e.id WHERE b.id = ?', [id]);
        
        if (bookings.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        const booking = bookings[0];
        let seatsArray = [];
        try {
            seatsArray = booking.seats ? (typeof booking.seats === 'string' ? JSON.parse(booking.seats) : booking.seats) : [];
        } catch (e) {
            seatsArray = [];
        }
        res.json({
            id: booking.id,
            eventId: booking.event_id,
            userId: booking.user_id,
            seats: seatsArray,
            quantity: booking.quantity,
            totalAmount: booking.total_amount,
            status: booking.status || 'pending',
            createdAt: booking.booking_date || booking.created_at,
            name: booking.name,
            email: booking.email,
            mobile: booking.mobile
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
