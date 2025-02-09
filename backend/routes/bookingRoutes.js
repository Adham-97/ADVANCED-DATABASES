const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/bookings', bookingController.createBooking);
router.get('/bookings', bookingController.getAllBookings);
router.get('/bookings/:booking_id', bookingController.getBookingById);
router.put('/bookings/:booking_id', bookingController.updateBooking);
router.delete('/bookings/:booking_id', bookingController.deleteBooking);
router.get('/bokings/location/:location_id', bookingController.getCarsByLocation);
module.exports = router;

