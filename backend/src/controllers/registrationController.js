const Registration = require('../models/Registration');
const Season = require('../models/Season');
const User = require('../models/User');

// @desc    Register for a crop season (Farmer)
// @route   POST /api/registrations
const registerCrop = async (req, res) => {
  try {
    const { seasonId, acres } = req.body;
    const farmerId = req.user._id;

    const season = await Season.findById(seasonId);
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }

    if (season.status !== 'active') {
      return res.status(400).json({ message: 'Season is not active' });
    }

    if (acres > season.remainingAcres) {
      return res.status(400).json({ 
        message: `Only ${season.remainingAcres} acres remaining` 
      });
    }

    const expectedYield = acres * season.yieldPerAcre;
    const expectedIncome = acres * season.yieldPerAcre * season.price;

    const registration = await Registration.create({
      farmer: farmerId,
      season: seasonId,
      acres,
      expectedYield,
      expectedIncome,
      status: 'approved'
    });

    // Update season registered acres
    season.registeredAcres += acres;
    season.remainingAcres -= acres;
    season.progress = (season.registeredAcres / season.totalAcresNeeded) * 100;
    await season.save();

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my registrations (Farmer)
// @route   GET /api/registrations/my
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ farmer: req.user._id })
      .populate('season', 'name startDate endDate')
      .populate({
        path: 'season',
        populate: { path: 'crop', select: 'name image' }
      });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registrations (Admin only)
// @route   GET /api/registrations
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('farmer', 'phoneNumber')
      .populate({
        path: 'season',
        populate: { path: 'crop', select: 'name image' }
      });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve registration (Admin only)
// @route   PUT /api/registrations/:id/approve
const approveRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject registration (Admin only)
// @route   PUT /api/registrations/:id/reject
const rejectRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerCrop, getMyRegistrations, getAllRegistrations, approveRegistration, rejectRegistration };