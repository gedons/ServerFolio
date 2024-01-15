const Order = require('../models/Order');
const User = require('../models/User');
const moment = require('moment');
const paymentController = require('../controllers/paymentController');

// Place an order
exports.placeOrderAndInitiatePayment  = async (req, res) => {
  try {
    const { email, amount, products } = req.body;

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newOrder = new Order({
      user: req.user,
      products,
      totalPrice: amount,  
      status: 'Pending',
    });

    const savedOrder = await newOrder.save();

     // Initialize payment for the order
     const amountInNaira = amount;
     const { paymentInfo, paymentReference } = await paymentController.initializePayment(email, amountInNaira);

     // Update the order with payment reference
     savedOrder.paymentReference = paymentReference;

    await savedOrder.save();      
 
     res.status(201).json({ message: 'Order placed and payment initialized', order: savedOrder, paymentInfo, paymentReference });
   } catch (error) {
     res.status(500).json({ message: 'Failed to place order and initialize payment', error: error.message });
   }
};

// Get all orders for a user (logged in user)
exports.getUserOrders = async (req, res) => {
    try {
      const userOrders = await Order.find({ user: req.user });
      res.status(200).json({ orders: userOrders });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user orders', error: error.message });
    }
};

// Get order count for logged-in user
exports.getUserOrderCount = async (req, res) => {
  try {
    const userId = req.user;  
    const orderCount = await Order.countDocuments({ user: userId });
    
    res.status(200).json({ orderCount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order count', error: error.message });
  }
};

// Get all orders (for admin)
exports.getAllOrders = async (req, res) => {

    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Permission denied. Only admin users can get all orders.' });
    }

    try {
      const allOrders = await Order.find().populate('user', 'firstname lastname email address postcode').populate({
        path: 'products.product',
        select: 'title quantity'
    });
      res.status(200).json({ orders: allOrders });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get all orders', error: error.message });
    }
};

// Get all orders for a user (based on id) //for admin
exports.getUserOrder = async (req, res) => {
  try {
    const { userId } = req.params; 
    const userOrders = await Order.find({ user: userId }).populate({
      path: 'products.product',
      select: 'title quantity'
  }); 
    res.status(200).json({ orders: userOrders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user orders', error: error.message });
  }
};

// Update order status (for admin)
exports.updateOrderStatus = async (req, res) => {

    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Permission denied. Only admin users can update order.' });
    }

    try {
      const { orderId, status } = req.body;
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      order.status = status;
      const updatedOrder = await order.save();
  
      res.status(200).json({ message: 'Order status updated', order: updatedOrder });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
  };

// Delete an order (for admin)
exports.deleteOrder = async (req, res) => {

    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Permission denied. Only admin users can delete order.' });
    }

    try {
      const orderId = req.params.orderId;
  
      const deletedOrder = await Order.findByIdAndDelete(orderId);
      if (!deletedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete order', error: error.message });
    }
  };

// Calculate monthly income (for admin)
exports.getMonthlyIncome = async (req, res) => {
    try {
      // Get the current month and year
      const currentDate = moment();
      const startOfMonth = currentDate.startOf('month').toDate();
      const endOfMonth = currentDate.endOf('month').toDate();
  
      // Find orders within the current month
      const monthlyCompletedOrders  = await Order.find({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        status: 'Paid'
      });
  
      // Calculate total income
      const totalIncome = monthlyCompletedOrders .reduce((sum, order) => sum + order.totalPrice, 0);
  
      res.status(200).json({ totalIncome });
    } catch (error) {
      res.status(500).json({ message: 'Failed to calculate monthly income', error: error.message });
    }
};

// Get total number of orders
exports.getTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.status(200).json({ totalOrders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch total orders', error: error.message });
  }
};

 

 