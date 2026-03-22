const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema({
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: true
  },
  cropName: {
    type: String
  },
  cropImage: {
    type: String,
    default: '🌾'
  },
  name: {
    type: String,
    required: [true, 'Season name is required']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  requiredHarvest: {
    type: Number,
    required: true
  },
  yieldPerAcre: {
    type: Number,
    required: true
  },
  totalAcresNeeded: {
    type: Number,
    required: true
  },
  registeredAcres: {
    type: Number,
    default: 0
  },
  remainingAcres: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'upcoming'],
    default: 'active'
  },
  progress: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Season', seasonSchema);