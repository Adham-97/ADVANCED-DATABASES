const Review = require('../models/review'); // Import Review model
const redisClient = require('../database/redisClient'); // Redis client

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { review_id, customer_id, car_id, booking_id, rating, comment } = req.body;

    const newReview = new Review({
      review_id,
      customer_id,
      car_id,
      booking_id,
      rating,
      comment,
    });

    await newReview.save();

    // Invalidate cached review list
    redisClient.del('reviews');

    res.status(201).json({ message: 'Review created successfully!', review: newReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create review' });
  }
};

// Get all reviews with caching
exports.getAllReviews = async (req, res) => {
  try {
    redisClient.get('reviews', async (err, cachedData) => {
      if (err) {
        console.error('Redis Error:', err);
        return res.status(500).json({ message: 'Redis error' });
      }

      if (cachedData) {
        console.log('Serving reviews from cache');
        return res.status(200).json(JSON.parse(cachedData));
      }

      const reviews = await Review.find();
      redisClient.setex('reviews', 3600, JSON.stringify(reviews)); // Cache for 1 hour

      res.status(200).json(reviews);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

// Get review by ID with caching
exports.getReviewById = async (req, res) => {
  try {
    const { review_id } = req.params;

    redisClient.get(`review:${review_id}`, async (err, cachedData) => {
      if (err) {
        console.error('Redis Error:', err);
        return res.status(500).json({ message: 'Redis error' });
      }

      if (cachedData) {
        console.log('Serving review from cache');
        return res.status(200).json(JSON.parse(cachedData));
      }

      const review = await Review.findOne({ review_id });

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      redisClient.setex(`review:${review_id}`, 3600, JSON.stringify(review)); // Cache for 1 hour

      res.status(200).json(review);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch review' });
  }
};

// Update review by ID and invalidate cache
exports.updateReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const { rating, comment } = req.body;

    const updatedReview = await Review.findOneAndUpdate(
      { review_id },
      { rating, comment },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Invalidate cache for updated review
    redisClient.del(`review:${review_id}`);
    redisClient.del('reviews');

    res.status(200).json({ message: 'Review updated successfully!', review: updatedReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update review' });
  }
};

// Delete review by ID and clear cache
exports.deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const deletedReview = await Review.findOneAndDelete({ review_id });

    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Invalidate cache
    redisClient.del(`review:${review_id}`);
    redisClient.del('reviews');

    res.status(200).json({ message: 'Review deleted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete review' });
  }
};

