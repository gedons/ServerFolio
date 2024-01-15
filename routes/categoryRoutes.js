// routes/categoryRoutes.js

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const multerConfig  = require('../middleware/multerConfig');

// Create a new category
router.post('/create', authMiddleware.verifyToken, categoryController.createCategory);

// Handle image upload for a specific category by ID
router.post('/:categoryId/image', multerConfig.single('image'), categoryController.uploadCategoryImage);

// Get all categories
router.get('/all', categoryController.getAllCategories);

// Get a single category by ID
router.get('/:categoryId', categoryController.getCategoryById);

// Update a category by ID
router.put('/update/:categoryId', authMiddleware.verifyToken, categoryController.updateCategoryById);

// Delete a category by ID
router.delete('/delete/:categoryId', authMiddleware.verifyToken, categoryController.deleteCategoryById);

module.exports = router;