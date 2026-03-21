const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    minlength: 3
  },
  nicNumber: {
    type: String,
    required: [true, 'NIC number is required'],
    unique: true
  },
  birthday: Date,
  address: String,
  district: String,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  email: String,
  bio: String,
  profilePicture: String
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);