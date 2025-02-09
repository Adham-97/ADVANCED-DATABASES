const Booking = require('../models/bookingModel');
const redisClient = require('../database/redisClient'); // Redis Client

// Create a new booking and invalidate cache
exports.createBooking = async (req, res) => {
  try {
    const { booking_id, customer_id, car_id, pickup_location_id, dropoff_location_id, rental_start_date, rental_end_date, total_amount, payment_id } = req.body;

    const newBooking = new Booking({
      booking_id,
      customer_id,
      car_id,
      pickup_location_id,
      dropoff_location_id,
      rental_start_date,
      rental_end_date,
      total_amount,
      payment_id,
    });

    const savedBooking = await newBooking.save();

    // Invalidate Redis cache
    redisClient.del('bookings:all'); // Invalidate all bookings cache
    redisClient.del(`userBookings:${customer_id}`); // Invalidate user-specific bookings cache
    redisClient.del(`carBookings:${car_id}`); // Invalidate car-specific bookings cache

    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ message: 'Error creating booking', error: err.message });
  }
};

// Get all bookings with Redis caching
exports.getAllBookings = async (req, res) => {
  try {
    redisClient.get('bookings:all', async (err, cachedData) => {
      if (err) {
        console.error('Redis Error:', err);
        return res.status(500).json({ message: 'Redis error' });
      }

      if (cachedData) {
        console.log('Serving from Redis cache');
        return res.status(200).json(JSON.parse(cachedData));
      }

      const bookings = await Booking.find();

      if (bookings.length > 0) {
        redisClient.setex('bookings:all', 3600, JSON.stringify(bookings)); // Cache for 1 hour
      }

      res.json(bookings);
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving bookings', error: err.message });
  }
};

// Get a booking by ID with Redis caching
exports.getBookingById = async (req, res) => {
  const { booking_id } = req.params;

  try {
    redisClient.get(`booking:${booking_id}`, async (err, cachedData) => {
      if (err) {
        console.error('Redis Error:', err);
        return res.status(500).json({ message: 'Redis error' });
      }

      if (cachedData) {
        console.log('Serving from Redis cache');
        return res.status(200).json(JSON.parse(cachedData));
      }

      const booking = await Booking.findOne({ booking_id });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      redisClient.setex(`booking:${booking_id}`, 3600, JSON.stringify(booking)); // Cache for 1 hour
      res.json(booking);
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving booking', error: err.message });
  }
};

// Update a booking and invalidate cache
exports.updateBooking = async (req, res) => {
  const { booking_id } = req.params;
  const updateData = req.body;

  try {
    const updatedBooking = await Booking.findOneAndUpdate({ booking_id }, updateData, { new: true });

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Invalidate Redis cache
    redisClient.del('bookings:all');
    redisClient.del(`booking:${booking_id}`);
    redisClient.del(`userBookings:${updatedBooking.customer_id}`);
    redisClient.del(`carBookings:${updatedBooking.car_id}`);

    res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ message: 'Error updating booking', error: err.message });
  }
};

// Delete a booking and invalidate cache
exports.deleteBooking = async (req, res) => {
  const { booking_id } = req.params;

  try {
    const deletedBooking = await Booking.findOneAndDelete({ booking_id });

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Invalidate Redis cache
    redisClient.del('bookings:all');
    redisClient.del(`booking:${booking_id}`);
    redisClient.del(`userBookings:${deletedBooking.customer_id}`);
    redisClient.del(`carBookings:${deletedBooking.car_id}`);

    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting booking', error: err.message });
  }
};
// Get all cars by location with Redis caching
exports.getCarsByLocation = async (req, res) => {
  const { location_id } = req.params;

  try {
    redisClient.get(`cars:location:${location_id}`, async (err, cachedData) => {
      if (err) {
        console.error('Redis Error:', err);
        return res.status(500).json({ message: 'Redis error' });
      }

      if (cachedData) {
        console.log('Serving from Redis cache');
        return res.status(200).json(JSON.parse(cachedData));
      }

      const cars = await Car.find({ location_id });

      if (cars.length > 0) {
        redisClient.setex(`cars:location:${location_id}`, 3600, JSON.stringify(cars)); // Cache for 1 hour
      }

      res.json(cars);
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving cars', error: err.message });
  }
};

