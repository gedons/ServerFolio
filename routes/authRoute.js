const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();


// Registration
router.post('/register', authController.register);

// admin Login
router.post('/login', authController.login);



module.exports = router;  