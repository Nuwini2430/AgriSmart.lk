const Registration = require('../models/Registration');
const Season = require('../models/Season');

// @desc    Register for a crop season (Farmer)
const registerCrop = async (req, res) => {
  try {
    const { seasonId, acres } = req.body;
    const farmerId = req.user._id;

    const season = await Season.findById(seasonId).populate('crop', 'name image');
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }

    if (season.status !== 'active') {
      return res.status(400).json({ message: 'Season is not active' });
    }

    if (acres > season.remainingAcres) {
      return res.status(400).json({ 
        message: `Only ${season.remainingAcres} acres remaining for ${season.crop.name}` 
      });
    }

    const expectedYield = acres * season.yieldPerAcre;
    const expectedIncome = acres * season.yieldPerAcre * season.price;

    const existingRegistration = await Registration.findOne({
      farmer: farmerId,
      season: seasonId,
      status: { $in: ['approved', 'active', 'pending'] }
    });

    if (existingRegistration) {
      return res.status(400).json({ 
        message: 'You have already registered for this season' 
      });
    }

    const registration = await Registration.create({
      farmer: farmerId,
      season: seasonId,
      acres,
      expectedYield,
      expectedIncome,
      status: 'approved',
      cropName: season.crop.name,
      cropImage: season.crop.image,
      seasonName: season.name,
      startDate: season.startDate,
      endDate: season.endDate,
      yieldPerAcre: season.yieldPerAcre,
      price: season.price,
      registeredDate: new Date()
    });

    season.registeredAcres += acres;
    season.remainingAcres -= acres;
    season.progress = (season.registeredAcres / season.totalAcresNeeded) * 100;
    await season.save();

    res.status(201).json({
      ...registration.toObject(),
      crop: season.crop
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my registrations (Farmer)
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ farmer: req.user._id })
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registrations (Admin only)
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('farmer', 'phoneNumber')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get registration by ID
const getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    if (registration.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve registration (Admin only)
const approveRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    if (registration.status !== 'pending') {
      return res.status(400).json({ message: 'Registration is not pending' });
    }
    registration.status = 'approved';
    await registration.save();
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject registration (Admin only)
const rejectRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    if (registration.status !== 'pending') {
      return res.status(400).json({ message: 'Registration is not pending' });
    }
    registration.status = 'rejected';
    await registration.save();
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete registration (Farmer ends season)
const completeRegistration = async (req, res) => {
  try {
    const { actualHarvest, notes } = req.body;
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    if (registration.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (registration.status !== 'approved' && registration.status !== 'active') {
      return res.status(400).json({ message: 'Registration is not active' });
    }
    const price = registration.price || 0;
    const actualIncome = actualHarvest * price;
    registration.status = 'completed';
    registration.actualHarvest = actualHarvest;
    registration.actualIncome = isNaN(actualIncome) ? 0 : actualIncome;
    registration.notes = notes || '';
    registration.completedDate = new Date();
    await registration.save();
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update registration
const updateRegistration = async (req, res) => {
  try {
    const { actualHarvest, notes, status } = req.body;
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    if (registration.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (actualHarvest) {
      registration.actualHarvest = actualHarvest;
      registration.actualIncome = actualHarvest * (registration.price || 0);
    }
    if (notes) registration.notes = notes;
    if (status) {
      registration.status = status;
      if (status === 'completed') registration.completedDate = new Date();
    }
    await registration.save();
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete registration (Admin only)
const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    if (registration.status === 'approved' || registration.status === 'active') {
      const season = await Season.findById(registration.season);
      if (season) {
        season.registeredAcres -= registration.acres;
        season.remainingAcres += registration.acres;
        season.progress = (season.registeredAcres / season.totalAcresNeeded) * 100;
        await season.save();
      }
    }
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerCrop,
  getMyRegistrations,
  getAllRegistrations,
  getRegistrationById,
  approveRegistration,
  rejectRegistration,
  completeRegistration,
  updateRegistration,
  deleteRegistration
};