const User = require('../models/User');
const Category = require('../models/Order');
const bcrypt = require('bcrypt');

// Fetch user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { firstname, lastname, email, state, country, phone, postcode, address } = req.body;

    const user = await User.findByIdAndUpdate(req.user, { firstname, lastname, email, state, country, phone, postcode, address }, { new: true });
    res.status(200).json({ message: 'User profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user profile', error: error.message });
  }
};

// Change user password
exports.changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid current password' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to change password', error: error.message });
    }
};
  
// Delete user account (Admin)
exports.deleteUserAccount = async (req, res) => {
try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }


    res.status(200).json({ message: 'User account deleted successfully' });
} catch (error) {
    res.status(500).json({ message: 'Failed to delete user account', error: error.message });
}
};

// View all users (only accessible to admin)
exports.viewAllUsers = async (req, res) => {
    try {

        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Permission denied. Only admin users can view all users.' });
        }

      const users = await User.find();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};


//update admin details
exports.updateAdminDetails = async (req, res) => {
  try {

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Permission denied. Only admin users can view all users.' });
    }

    const { firstname, email  } = req.body; 

    // Fetch admin user by ID or specific criteria
    const adminUser = await User.findById(req.user);  

    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    adminUser.firstname = firstname;  
    adminUser.email = email;  
    await adminUser.save(); 

    res.status(200).json({ message: 'Admin details updated successfully', user: adminUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update admin details', error: error.message });
  }
};



// Update admin password
exports.updateAdminPassword = async (req, res) => {
  try {

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Permission denied! Only admin users can view all users.' });
    }

    const { currentPassword, newPassword } = req.body;

    const adminUser = await User.findById(req.user);

    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, adminUser.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    adminUser.password = hashedPassword;
    await adminUser.save();

    res.status(200).json({ message: 'Admin password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update admin password', error: error.message });
  }
};


// Get total number of users count
exports.getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ totalUsers });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch total users', error: error.message });
  }
};
