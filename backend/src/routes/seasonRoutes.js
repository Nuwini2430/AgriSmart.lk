const express = require('express');
const router = express.Router();
const { 
  startSeason, 
  getActiveSeasons, 
  getSeasonById, 
  endSeason,
  getAllSeasons,
  updateSeason,
  deleteSeason
} = require('../controllers/seasonController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// @route   POST /api/seasons - Start new season (Admin only)
router.post('/', protect, adminOnly, startSeason);

// @route   GET /api/seasons/active - Get all active seasons
router.get('/active', getActiveSeasons);

// @route   GET /api/seasons - Get all seasons (Admin only)
router.get('/', protect, adminOnly, getAllSeasons);

router.get('/:id', getSeasonById);
router.put('/:id', protect, adminOnly, updateSeason);
router.put('/:id/end', protect, adminOnly, endSeason);
router.delete('/:id', protect, adminOnly, deleteSeason);

module.exports = router;