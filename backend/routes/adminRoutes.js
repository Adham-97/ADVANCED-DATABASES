const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/bookings', adminController.getAllBookings);
router.get('/accidents', adminController.getAllAccidents);
router.put('/booking', adminController.updateBooking);
router.delete('/booking/:booking_id', adminController.deleteBooking);
router.delete('/accident/:accidentId', adminController.deleteAccident);
router.post('/car', adminController.addCar);
router.delete('/car/:car_id', adminController.deleteCar);
router.get('/cars', adminController.getAllCars);

module.exports = router;

