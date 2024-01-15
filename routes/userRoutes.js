const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch user profile
router.get('/profile', authMiddleware.verifyToken, userController.getUserProfile);

// Update user profile
router.put('/profile', authMiddleware.verifyToken, userController.updateUserProfile);

// Change password
router.put('/change-password', authMiddleware.verifyToken, userController.changePassword);

// Delete user account
router.delete('/profile/:userId', authMiddleware.verifyToken, userController.deleteUserAccount);

// View all users (only accessible to admin)
router.get('/profiles', authMiddleware.verifyToken, userController.viewAllUsers);  

//update admin details
router.put('/admin/update-details', authMiddleware.verifyToken, userController.updateAdminDetails);  

//update admin password
router.put('/admin/update-password', authMiddleware.verifyToken, userController.updateAdminPassword);  

// Get total number of users count
router.get('/getTotalUsers',  authMiddleware.verifyToken,  userController.getTotalUsers);

module.exports = router;
