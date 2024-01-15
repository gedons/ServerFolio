//const config = require('../config/config');
const Order = require('../models/Order');
//const paystack = require('paystack')(config.PAYSTACK_SECRET_KEY);

const https = require('https');
const querystring = require('querystring');

exports.initializePayment = async (email, amountInNaira) => {
    try {
      const amountInKobo = amountInNaira * 100; 
      const postData = JSON.stringify({
        email,
        amount: amountInKobo,         
      });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: 'Bearer sk_test_73d239b922a8dbe050ada4b7f453580c0c8e5a86',
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      }
    };
    
    return new Promise((resolve, reject) => {
        const payReq = https.request(options, payRes => {
          let data = '';

    payRes.on('data', (chunk) => {
        data += chunk;
      });

      payRes.on('end', () => {
        const paymentInfo = JSON.parse(data);          
        const paymentReference = paymentInfo.data.reference;      
        resolve({ paymentInfo, paymentReference });
      });
    });

    payReq.on('error', error => {
      console.error(error);
      reject(error);
    });

    payReq.write(postData);
    payReq.end();
  });
  } catch (error) {
    res.status(500).json({ message: 'Failed to initialize payment', error: error.message });
  }
};



exports.handlePaymentWebhook = async (req, res) => {
  try {
    const eventData = req.body;  
    const paymentReference = eventData.data.reference; 

    // Find the order based on the payment reference field
    const order = await Order.findOne({ paymentReference });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status based on payment status received
    const paymentStatus = eventData.event;

    if (paymentStatus === 'charge.success') {
      order.status = 'Paid';
      await order.save();
    } else if (paymentStatus === 'charge.failed') {
      order.status = 'Failed';
      await order.save();
    }

    res.status(200).end();  
  } catch (error) {
    res.status(500).json({ message: 'Failed to handle Paystack webhook', error: error.message });
  }
};

