// routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Add a product to the cart
router.post('/add-to-cart', authMiddleware.verifyToken, cartController.addToCart);

// Get the user's cart
router.get('/get-cart', authMiddleware.verifyToken, cartController.getCart);

// Update the quantity of a product in the cart
router.put('/update-quantity/:productId', authMiddleware.verifyToken, cartController.updateCartItemQuantity);

// Remove a product from the cart
router.delete('/remove-from-cart/:productId', authMiddleware.verifyToken, cartController.removeFromCart);

// delete all the cart
router.delete('/clear-all', authMiddleware.verifyToken, cartController.clearUserCart);

module.exports = router;
