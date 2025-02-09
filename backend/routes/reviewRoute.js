const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Create a new review
router.post('/reviews', reviewController.createReview);

// Get all reviews
router.get('/reviews', reviewController.getAllReviews);

// Get review by ID
router.get('/reviews/:review_id', reviewController.getReviewById);

// Update review by ID
router.put('/reviews/:review_id', reviewController.updateReview);

// Delete review by ID
router.delete('/reviews/:review_id', reviewController.deleteReview);

module.exports = router;
