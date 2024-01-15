const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Add a review for a product
router.post('/products/:productId/reviews', authMiddleware.verifyToken, reviewController.addReview);

// Get all reviews for a product
router.get('/products/:productId/reviews', reviewController.getAllReviews);

// Update a review
router.put('/reviews/:reviewId', authMiddleware.verifyToken, reviewController.updateReview);

// Delete a review
router.delete('/reviews/:reviewId', authMiddleware.verifyToken, reviewController.deleteReview);

module.exports = router;
