const Accident = require('../models/accidentModel'); 
const redisClient = require('../database/redisClient'); 

// Create a new accident record and clear the Redis cache
exports.createAccident = async (req, res) => {
  try {
    const { id, car_id, location_id, date, description } = req.body;
    
    // Store in MongoDB/Neo4j
    const accident = await Accident.createAccident(id, car_id, location_id, date, description);

    // Invalidate Redis cache after insertion
    redisClient.del(`accident:${id}`);
    redisClient.del(`accidents:car:${car_id}`);
    redisClient.del(`accidents:all`);

    res.status(201).json(accident);
  } catch (error) {
    console.error('Error creating accident:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get accidents by car_id with Redis caching
exports.getAccidentsByVehicle = async (req, res) => {
  const { car_id } = req.params;

  try {
    // Step 1: Check if data is cached in Redis
    redisClient.get(`accidents:car:${car_id}`, async (err, cachedData) => {
      if (err) {
        console.error('Error fetching from Redis:', err);
        return res.status(500).json({ message: 'Redis error' });
      }

      if (cachedData) {
        console.log('Serving from Redis cache');
        return res.status(200).json(JSON.parse(cachedData)); // Serve cached data
      }

      // Step 2: Fetch from MongoDB/Neo4j if not in Redis
      const accidents = await Accident.getAccidentsByVehicle(car_id);

      if (accidents.length > 0) {
        // Step 3: Cache the result in Redis for 1 hour (3600 seconds)
        redisClient.setex(`accidents:car:${car_id}`, 3600, JSON.stringify(accidents));
      }

      res.status(200).json(accidents);
    });
  } catch (error) {
    console.error('Error fetching accidents:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all accidents with Redis caching
exports.getAllAccidents = async (req, res) => {
  try {
    // Step 1: Check Redis cache first
    redisClient.get('accidents:all', async (err, cachedData) => {
      if (err) {
        console.error('Error fetching from Redis:', err);
        return res.status(500).json({ message: 'Redis error' });
      }

      if (cachedData) {
        console.log('Serving from Redis cache');
        return res.status(200).json(JSON.parse(cachedData)); // Serve cached data
      }

      // Step 2: Fetch from MongoDB/Neo4j if not in Redis
      const accidents = await Accident.getAllAccidents();

      if (accidents.length > 0) {
        // Step 3: Store in Redis for 1 hour (3600 seconds)
        redisClient.setex('accidents:all', 3600, JSON.stringify(accidents));
      }

      res.status(200).json(accidents);
    });
  } catch (error) {
    console.error('Error fetching all accidents:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};



