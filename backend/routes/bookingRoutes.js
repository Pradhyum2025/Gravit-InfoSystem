// ---------------------------------------------------------------------
// <copyright file="bookingRoutes.js" company="Gravit InfoSystem">
// Copyright (c) Gravit InfoSystem. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.get('/user/:userId', bookingController.getUserBookings);
router.get('/:id', bookingController.getBookingById);
router.get('/', bookingController.getAllBookings);
router.put('/:id', bookingController.updateBooking);

module.exports = router;
