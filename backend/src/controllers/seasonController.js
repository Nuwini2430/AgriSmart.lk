const Season = require('../models/Season');
const Crop = require('../models/Crop');

// @desc    Start new season (Admin only)
// @route   POST /api/seasons
const startSeason = async (req, res) => {
  try {
    const { cropId, name, startDate, endDate, requiredHarvest, yieldPerAcre, price } = req.body;

    // Validate input
    if (!cropId || !name || !startDate || !endDate || !requiredHarvest || !yieldPerAcre || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    // Check if there's already an active season for this crop
    const existingActiveSeason = await Season.findOne({ 
      crop: cropId, 
      status: 'active' 
    });
    
    if (existingActiveSeason) {
      return res.status(400).json({ 
        message: `There is already an active season for ${crop.name}. Please end it first before starting a new one.` 
      });
    }

    const totalAcresNeeded = requiredHarvest / yieldPerAcre;
    const remainingAcres = totalAcresNeeded;

    const season = await Season.create({
      crop: cropId,
      cropName: crop.name,
      cropImage: crop.image,
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      requiredHarvest: Number(requiredHarvest),
      yieldPerAcre: Number(yieldPerAcre),
      totalAcresNeeded,
      registeredAcres: 0,
      remainingAcres,
      price: Number(price),
      status: 'active',
      progress: 0
    });

    const populatedSeason = await Season.findById(season._id).populate('crop', 'name image');
    
    res.status(201).json({
      _id: populatedSeason._id,
      crop: {
        _id: populatedSeason.crop._id,
        name: populatedSeason.crop.name,
        image: populatedSeason.crop.image
      },
      cropName: populatedSeason.cropName,
      cropImage: populatedSeason.cropImage,
      name: populatedSeason.name,
      startDate: populatedSeason.startDate,
      endDate: populatedSeason.endDate,
      requiredHarvest: populatedSeason.requiredHarvest,
      yieldPerAcre: populatedSeason.yieldPerAcre,
      totalAcresNeeded: populatedSeason.totalAcresNeeded,
      registeredAcres: populatedSeason.registeredAcres,
      remainingAcres: populatedSeason.remainingAcres,
      price: populatedSeason.price,
      status: populatedSeason.status,
      progress: populatedSeason.progress
    });
  } catch (error) {
    console.error("Start season error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active seasons (Public - for farmers to register)
// @route   GET /api/seasons/active
const getActiveSeasons = async (req, res) => {
  try {
    const seasons = await Season.find({ status: 'active' })
      .populate('crop', 'name image')
      .sort({ startDate: -1 });
    
    // Format response for frontend
    const formattedSeasons = seasons.map(season => ({
      _id: season._id,
      crop: {
        _id: season.crop?._id,
        name: season.crop?.name || season.cropName,
        image: season.crop?.image || season.cropImage
      },
      cropName: season.cropName,
      cropImage: season.cropImage,
      name: season.name,
      startDate: season.startDate,
      endDate: season.endDate,
      requiredHarvest: season.requiredHarvest,
      yieldPerAcre: season.yieldPerAcre,
      totalAcresNeeded: season.totalAcresNeeded,
      registeredAcres: season.registeredAcres,
      remainingAcres: season.remainingAcres,
      price: season.price,
      status: season.status,
      progress: season.totalAcresNeeded > 0 
        ? (season.registeredAcres / season.totalAcresNeeded) * 100 
        : 0
    }));
    
    res.json(formattedSeasons);
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
    
    res.json({
      _id: season._id,
      crop: {
        _id: season.crop?._id,
        name: season.crop?.name || season.cropName,
        image: season.crop?.image || season.cropImage
      },
      cropName: season.cropName,
      cropImage: season.cropImage,
      name: season.name,
      startDate: season.startDate,
      endDate: season.endDate,
      requiredHarvest: season.requiredHarvest,
      yieldPerAcre: season.yieldPerAcre,
      totalAcresNeeded: season.totalAcresNeeded,
      registeredAcres: season.registeredAcres,
      remainingAcres: season.remainingAcres,
      price: season.price,
      status: season.status,
      progress: season.totalAcresNeeded > 0 
        ? (season.registeredAcres / season.totalAcresNeeded) * 100 
        : 0
    });
  } catch (error) {
    console.error("Get season error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    End season (Admin only)
// @route   PUT /api/seasons/:id/end
const endSeason = async (req, res) => {
  try {
    const season = await Season.findById(req.params.id);
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    
    if (season.status !== 'active') {
      return res.status(400).json({ message: 'Season is not active' });
    }
    
    season.status = 'completed';
    await season.save();
    
    const populatedSeason = await Season.findById(season._id).populate('crop', 'name image');
    
    res.json({
      _id: populatedSeason._id,
      crop: {
        _id: populatedSeason.crop?._id,
        name: populatedSeason.crop?.name || populatedSeason.cropName,
        image: populatedSeason.crop?.image || populatedSeason.cropImage
      },
      name: populatedSeason.name,
      status: populatedSeason.status,
      message: 'Season ended successfully'
    });
  } catch (error) {
    console.error("End season error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all seasons (for farmers to see history and for admin)
// @route   GET /api/seasons
const getAllSeasons = async (req, res) => {
  try {
    const seasons = await Season.find()
      .populate('crop', 'name image')
      .sort({ createdAt: -1 });
    
    const formattedSeasons = seasons.map(season => ({
      _id: season._id,
      crop: {
        _id: season.crop?._id,
        name: season.crop?.name || season.cropName,
        image: season.crop?.image || season.cropImage
      },
      cropName: season.cropName,
      cropImage: season.cropImage,
      name: season.name,
      startDate: season.startDate,
      endDate: season.endDate,
      requiredHarvest: season.requiredHarvest,
      yieldPerAcre: season.yieldPerAcre,
      totalAcresNeeded: season.totalAcresNeeded,
      registeredAcres: season.registeredAcres,
      remainingAcres: season.remainingAcres,
      price: season.price,
      status: season.status,
      progress: season.totalAcresNeeded > 0 
        ? (season.registeredAcres / season.totalAcresNeeded) * 100 
        : 0,
      createdAt: season.createdAt
    }));
    
    res.json(formattedSeasons);
  } catch (error) {
    console.error("Get all seasons error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update season (Admin only)
// @route   PUT /api/seasons/:id
const updateSeason = async (req, res) => {
  try {
    const { name, startDate, endDate, requiredHarvest, yieldPerAcre, price } = req.body;
    
    const season = await Season.findById(req.params.id);
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    
    if (season.status === 'completed') {
      return res.status(400).json({ message: 'Cannot update completed season' });
    }
    
    if (name) season.name = name;
    if (startDate) season.startDate = new Date(startDate);
    if (endDate) season.endDate = new Date(endDate);
    if (requiredHarvest) season.requiredHarvest = Number(requiredHarvest);
    if (yieldPerAcre) season.yieldPerAcre = Number(yieldPerAcre);
    if (price) season.price = Number(price);
    
    // Recalculate total acres needed and remaining acres
    if (requiredHarvest || yieldPerAcre) {
      const totalAcresNeeded = season.requiredHarvest / season.yieldPerAcre;
      season.totalAcresNeeded = totalAcresNeeded;
      season.remainingAcres = totalAcresNeeded - season.registeredAcres;
      if (season.remainingAcres < 0) season.remainingAcres = 0;
      season.progress = (season.registeredAcres / totalAcresNeeded) * 100;
    }
    
    await season.save();
    
    const populatedSeason = await Season.findById(season._id).populate('crop', 'name image');
    res.json(populatedSeason);
  } catch (error) {
    console.error("Update season error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete season (Admin only)
// @route   DELETE /api/seasons/:id
const deleteSeason = async (req, res) => {
  try {
    const season = await Season.findById(req.params.id);
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }
    
    if (season.registeredAcres > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete season with existing registrations' 
      });
    }
    
    await Season.findByIdAndDelete(req.params.id);
    res.json({ message: 'Season deleted successfully' });
  } catch (error) {
    console.error("Delete season error:", error);
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