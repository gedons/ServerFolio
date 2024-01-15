
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/initialize-payment', authMiddleware.verifyToken, paymentController.initializePayment);
router.post('/payment-webhook', paymentController.handlePaymentWebhook);
 

module.exports = router;