const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require('../config/config');

  exports.register = async (req, res) => {
      const { name, email, password} = req.body;
    
      // Check if the email is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
    
      // Create a new user
      const newUser = new User({
        name,        
        email,
        password: hashedPassword,       
      });
    
      try {
        await newUser.save();
        res.status(201).json({ message: 'Registration successful'});
      } catch (error) {
        res.status(500).json({ message: `Registration failed : ${error}` });
      }
  };


  // User login
  exports.userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });

      // Check if the user exists
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Verify the password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Create a JWT token
      const UserauthToken = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        config.SESSION_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ user, UserauthToken });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  };