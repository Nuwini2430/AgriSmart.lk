const User = require('../models/User');
const Profile = require('../models/Profile');
const Registration = require('../models/Registration');

// @desc    Get all farmers (Admin only)
// @route   GET /api/farmers
const getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' }).select('-password');
    const farmersWithProfile = await Promise.all(
      farmers.map(async (farmer) => {
        const profile = await Profile.findOne({ user: farmer._id });
        const registrations = await Registration.find({ farmer: farmer._id });
        const totalAcres = registrations.reduce((sum, r) => sum + r.acres, 0);
        const crops = [...new Set(registrations.map(r => r.cropName))];
        
        return {
          _id: farmer._id,
          phoneNumber: farmer.phoneNumber,
          profileCompleted: farmer.profileCompleted,
          registeredDate: farmer.createdAt,
          ...(profile ? profile.toObject() : {}),
          totalAcres,
          crops: crops.length ? crops : []
        };
      })
    );
    res.json(farmersWithProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get farmer by ID (Admin only)
// @route   GET /api/farmers/:id
const getFarmerById = async (req, res) => {
  try {
    const farmer = await User.findById(req.params.id).select('-password');
    if (!farmer || farmer.role !== 'farmer') {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    
    const profile = await Profile.findOne({ user: farmer._id });
    const registrations = await Registration.find({ farmer: farmer._id })
      .populate('season', 'name startDate endDate');
    
    res.json({
      ...farmer.toObject(),
      profile,
      registrations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllFarmers, getFarmerById };