const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true},
  lastname: { type: String, required: true},
  email: { type: String, required: true},
  password: { type: String, required: true},
  isAdmin: { type: Boolean, default: false },
  state: { type: String, required: true},
  country: { type: String, required: true},
  phone: { type: String, required: true},
  postcode: { type: String, required: false},
  address: { type: String, required: false},
//   verificationToken: String,  
//   verificationTokenExpiry: Date,
//   isEmailVerified: { type: Boolean, default: false }, 
//   resetPasswordToken: String,  
//   resetPasswordExpires: Date,
},
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
