// models/Payment.js

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  payment_id: { type: String, required: true, unique: true },
  booking_id: { type: String, required: true },
  customer_id: { type: String, required: true },
  amount: { type: Number, required: true },
  payment_date: { type: Date, default: Date.now },
  payment_method: String,
  status: String,
  transaction_details: {
    transaction_id: String,
    currency: String,
    payment_gateway: String,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);