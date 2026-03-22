const Season = require('../models/Season');
const Crop = require('../models/Crop');

// @desc    Start new season (Admin only)
// @route   POST /api/seasons
const startSeason = async (req, res) => {
  try {
    const { cropId, name, startDate, endDate, requiredHarvest, yieldPerAcre, price } = req.body;

    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    const totalAcresNeeded = requiredHarvest / yieldPerAcre;

    const season = await Season.create({
      crop: cropId,
      cropName: crop.name,
      cropImage: crop.image,
      name,
      startDate,
      endDate,
      requiredHarvest,
      yieldPerAcre,
      totalAcresNeeded,
      remainingAcres: totalAcresNeeded,
      price,
      status: 'active'
    });

    const populatedSeason = await Season.findById(season._id).populate('crop', 'name image');
    res.status(201).json(populatedSeason);
  } catch (error) {
    console.error("Start season error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active seasons
// @route   GET /api/seasons/active
const getActiveSeasons = async (req, res) => {
  try {
    const seasons = await Season.find({ status: 'active' })
      .populate('crop', 'name image')
      .sort({ startDate: -1 });
    res.json(seasons);
  } catch (error) {
    console.error("Get active seasons error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get season by ID
// @route   GET /api/seasons/:id
const getSeasonById = async (req, res) => {
  try {
    const season = await Season.findById(req.params.id).populate('crop', 'name image');
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    res.json(season);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    End season (Admin only)
// @route   PUT /api/seasons/:id/end
const endSeason = async (req, res) => {
  try {
    const season = await Season.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    ).populate('crop', 'name image');
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    res.json(season);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all seasons (Admin only)
// @route   GET /api/seasons/all
const getAllSeasons = async (req, res) => {
  try {
    const seasons = await Season.find()
      .populate('crop', 'name image')
      .sort({ createdAt: -1 });
    res.json(seasons);
  } catch (error) {
    console.error("Get all seasons error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update season (Admin only)
// @route   PUT /api/seasons/:id
const updateSeason = async (req, res) => {
  try {
    const season = await Season.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('crop', 'name image');
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    res.json(season);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete season (Admin only)
// @route   DELETE /api/seasons/:id
const deleteSeason = async (req, res) => {
  try {
    const season = await Season.findByIdAndDelete(req.params.id);
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    res.json({ message: 'Season deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  startSeason, 
  getActiveSeasons, 
  getSeasonById, 
  endSeason,
  getAllSeasons,
  updateSeason,
  deleteSeason
};