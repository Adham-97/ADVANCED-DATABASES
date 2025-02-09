// models/location-_id.js

const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  location_id: { type: String, required: true, unique: true },
  name: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip_code: String,
  },
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
});

module.exports = mongoose.model('location-_id', locationSchema);