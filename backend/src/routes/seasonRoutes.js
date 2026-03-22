const express = require('express');
const router = express.Router();
const { 
  startSeason, 
  getActiveSeasons, 
  getSeasonById, 
  endSeason
} = require('../controllers/seasonController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// @route   POST /api/seasons - Start new season (Admin only)
// @route   GET /api/seasons/active - Get all active seasons
router.route('/')
  .post(protect, adminOnly, startSeason);

router.get('/active', getActiveSeasons);

router.route('/:id')
  .get(getSeasonById)
  .put(protect, adminOnly, endSeason);

// @route   PUT /api/seasons/:id/end - End season (Admin only)
router.put('/:id/end', protect, adminOnly, endSeason);

module.exports = router;