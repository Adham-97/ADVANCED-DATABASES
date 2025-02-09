const Admin = require('../models/adminModel');  // Import MongoDB/Neo4j Model
const redisClient = require('../database/redisClient'); // Import Redis Client

// Get all bookings with Redis caching
exports.getAllBookings = async (req, res) => {
  try {
    redisClient.get('bookings:all', async (err, cachedData) => {
      if (err) {
        console.error('Error fetching from Redis:', err);
        return res.status(500).json({ message: 'Redis error' });
      }

      if (cachedData) {
        console.log('Serving from Redis cache');
        return res.status(200).json(JSON.parse(cachedData)); 
      }

      const bookings = await Admin.getAllBookings();

      if (bookings.length > 0) {
        redisClient.setex('bookings:all', 3600, JSON.stringify(bookings)); // Cache for 1 hour
      }

      res.json(bookings);
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving bookings' });
  }
};

// Get all accident logs with Redis caching
exports.getAllAccidents = async (req, res) => {
  try {
    redisClient.get('accidents:all', async (err, cachedData) => {
      if (err) {
        console.error('Error fetching from Redis:', err);
        return res.status(500).json({ message: 'Redis error' });
      }

      if (cachedData) {
        console.log('Serving from Redis cache');
        return res.status(200).json(JSON.parse(cachedData));
      }

      const accidents = await Admin.getAllAccidents();

      if (accidents.length > 0) {
        redisClient.setex('accidents:all', 3600, JSON.stringify(accidents)); // Cache for 1 hour
      }

      res.json(accidents);
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving accident logs' });
  }
};

// Update booking status and invalidate Redis cache
exports.updateBooking = async (req, res) => {
  const { booking_id, status } = req.body;
  try {
    const updatedBooking = await Admin.updateBooking(booking_id, status);

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Invalidate Redis cache
    redisClient.del('bookings:all');
    redisClient.del(`booking:${booking_id}`);

    res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ message: 'Error updating booking' });
  }
};

// Delete booking and invalidate Redis cache
exports.deleteBooking = async (req, res) => {
  const { booking_id } = req.params;
  try {
    const deleted = await Admin.deleteBooking(booking_id);

    if (deleted) {
      // Invalidate Redis cache
      redisClient.del('bookings:all');
      redisClient.del(`booking:${booking_id}`);

      res.json({ message: 'Booking deleted successfully' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting booking' });
  }
};

// Delete accident log and invalidate Redis cache
exports.deleteAccident = async (req, res) => {
  const { accidentId } = req.params;
  try {
    const deleted = await Admin.deleteAccident(accidentId);

    if (deleted) {
      // Invalidate Redis cache
      redisClient.del('accidents:all');
      redisClient.del(`accident:${accidentId}`);

      res.json({ message: 'Accident log deleted successfully' });
    } else {
      res.status(404).json({ message: 'Accident log not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting accident log' });
  }
};

// Add a car and invalidate Redis cache
exports.addCar = async (req, res) => {
  try {
    const newCar = await Admin.addCar(req.body);

    // Invalidate Redis cache
    redisClient.del('cars:all');

    res.status(201).json({ message: 'Car added successfully', car: newCar });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a car and invalidate Redis cache
exports.deleteCar = async (req, res) => {
  try {
    const { car_id } = req.params;
    const deleted = await Admin.deleteCar(car_id);

    if (deleted) {
      // Invalidate Redis cache
      redisClient.del('cars:all');
      redisClient.del(`car:${car_id}`);

      res.json({ message: 'Car deleted successfully' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all cars with Redis caching
exports.getAllCars = async (req, res) => {
  try {
    redisClient.get('cars:all', async (err, cachedData) => {
      if (err) {
        console.error('Error fetching from Redis:', err);
        return res.status(500).json({ message: 'Redis error' });
      }

      if (cachedData) {
        console.log('Serving from Redis cache');
        return res.status(200).json(JSON.parse(cachedData));
      }

      const cars = await Admin.getAllCars();

      if (cars.length > 0) {
        redisClient.setex('cars:all', 3600, JSON.stringify(cars)); // Cache for 1 hour
      }

      res.json(cars);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




