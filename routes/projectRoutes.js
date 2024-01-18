const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const upload  = require('../middleware/upload');


// Create a new product route
router.post('/create', authMiddleware.verifyToken, upload.single('image'), projectController.createProject);

// Get all products
router.get('/all', projectController.getAllProjects);

// Get a single product by ID
router.get('/:projectId', projectController.getProjectById);

// Get products by category
router.get('/product-category/:categoryId', projectController.getProductsByCategory);

// get related products by category
router.get('/:productId/related', projectController.getRelatedProductsByCategory);

// Update a product by ID
router.put('/update/:productId', authMiddleware.verifyToken, projectController.updateProductById);

// Handle image upload for a specific product by ID
router.post('/:productId/image', projectController.uploadProductImage);

// Delete a product by ID
router.delete('/delete/:productId', authMiddleware.verifyToken, projectController.deleteProductById);

// Get total number of products
router.get('/getTotalProducts',  authMiddleware.verifyToken, projectController.getTotalProducts);

// Route for searching products
router.get('/search', projectController.searchProducts);


module.exports = router;