

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review_id: { type: String, required: true, unique: true },
  customer_id: { type: String, required: true },
  car_id: { type: String, required: true },
  booking_id: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  review_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);