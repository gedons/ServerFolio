const config = require('../config/config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
exports.verifyToken = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), config.SESSION_SECRET);
    // Fetch user details from the database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach user details to the request object
    req.user = { ...decoded, ...user._doc };
    next();

  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
