const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  middleName: String,
  lastName: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true,
    enum: ['customer', 'admin'], // Allow only 'customer' or 'admin'
    default: 'customer' // Default value is 'customer'
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensure email addresses are unique
  },
  password: {
    type: String,
    required: true
  }
});

const userModel = mongoose.model('userModel', userSchema);

module.exports = userModel;
