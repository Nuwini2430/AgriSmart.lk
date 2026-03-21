const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    unique: true
  },
  image: {
    type: String,
    default: '🌾'
  }
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);