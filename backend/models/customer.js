// models/Customer.js

const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  booking_id: String,
  car_id: String,
  rental_start_date: Date,
  rental_end_date: Date,
  total_amount: Number,
});

const customerSchema = new mongoose.Schema({
  customer_id: { type: String, required: true, unique: true },
  name: String,
  driver_license_number: String,
  contact_details: {
    email: { type: String, required: true, unique: true },
    phone: String,
  },
  password: { type: String, required: true }, // Password should be hashed
  address: {
    street: String,
    city: String,
    state: String,
    zip_code: String,
  },
  date_of_birth: Date,
  membership_status: String,
  rental_history: [rentalSchema],
  current_rentals: [rentalSchema],
});

module.exports = mongoose.model('Customer', customerSchema);

