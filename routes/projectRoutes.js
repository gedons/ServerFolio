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

// Get projects by category
router.get('/project-category/:categoryId', projectController.getProjectByCategory);

// get related projects by category
router.get('/:projectId/related', projectController.getRelatedProjectsByCategory);

// Update a product by ID
router.put('/update/:projectId', authMiddleware.verifyToken, projectController.updateProjectById);

// Delete a product by ID
router.delete('/delete/:projectId', authMiddleware.verifyToken, projectController.deleteProjectById);

// Get total number of products
router.get('/getTotalProducts',  authMiddleware.verifyToken, projectController.getTotalProducts);

// Route for searching products
router.get('/search', projectController.searchProducts);


module.exports = router;