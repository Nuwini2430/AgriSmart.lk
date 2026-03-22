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

    res.status(201).json(season);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active seasons
// @route   GET /api/seasons/active
const getActiveSeasons = async (req, res) => {
  try {
    const seasons = await Season.find({ status: 'active' }).populate('crop', 'name image');
    res.json(seasons);
  } catch (error) {
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
    );
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    res.json(season);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { startSeason, getActiveSeasons, getSeasonById, endSeason };