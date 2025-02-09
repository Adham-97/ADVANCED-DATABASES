const Profile = require('../models/profileModel');
const redisClient = require('../database/redisClient'); // Redis Client

// Get the profile of a user with Redis caching
exports.getProfile = async (req, res) => {
  const { customer_id } = req.params;

  try {
    redisClient.get(`profile:${customer_id}`, async (err, cachedData) => {
      if (err) {
        console.error('Redis Error:', err);
        return res.status(500).json({ message: 'Redis error' });
      }

      if (cachedData) {
        console.log('Serving profile from Redis cache');
        return res.status(200).json(JSON.parse(cachedData));
      }

      const profile = await Profile.getUserProfile(customer_id);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      redisClient.setex(`profile:${customer_id}`, 3600, JSON.stringify(profile)); // Cache for 1 hour

      res.json(profile);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update the profile of a user and invalidate cache
exports.updateProfile = async (req, res) => {
  const { customer_id } = req.params;
  const { name, email, phone } = req.body;

  try {
    const updatedProfile = await Profile.updateUserProfile(customer_id, name, email, phone);
    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Invalidate Redis cache
    redisClient.del(`profile:${customer_id}`);

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

