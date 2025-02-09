const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  booking_id: { type: String, required: true, unique: true },
  customer_id: { type: String, required: true },
  car_id: { type: String, required: true },
  pickup_location_id: { type: String, required: true },
  dropoff_location_id: { type: String, required: true },
  rental_start_date: { type: Date, required: true },
  rental_end_date: { type: Date, required: true },
  total_amount: { type: Number, required: true },
  payment_id: { type: String },
});

module.exports = mongoose.model('Booking', bookingSchema);

