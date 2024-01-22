const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const upload  = require('../middleware/uploadBlog');


// Create a new blog route
router.post('/create', authMiddleware.verifyToken, upload.single('image'), blogController.createBlog);

// Get all blog
router.get('/all', blogController.getAllBlogs);

// Get a single blog by ID
router.get('/:projectId', blogController.getProjectById);


// Update a blog by ID
router.put('/update/:projectId', authMiddleware.verifyToken, blogController.updateProjectById);

// Delete a blog by ID
router.delete('/delete/:projectId', authMiddleware.verifyToken, blogController.deleteProjectById);

// Get total number of blog
router.get('/total/getTotalProjects', blogController.getTotalProjects);



module.exports = router;