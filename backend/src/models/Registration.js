const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Season',
    required: true
  },
  acres: {
    type: Number,
    required: true,
    min: 0.1
  },
  expectedYield: {
    type: Number,
    required: true
  },
  expectedIncome: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  qrCode: String,
  registeredDate: {
    type: Date,
    default: Date.now
  },
  actualHarvest: Number,
  actualIncome: Number,
  notes: String,
  completedDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);