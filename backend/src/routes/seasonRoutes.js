const express = require('express');
const router = express.Router();
const { startSeason, getActiveSeasons, getSeasonById, endSeason } = require('../controllers/seasonController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.route('/')
  .post(protect, adminOnly, startSeason);

router.get('/active', getActiveSeasons);

router.route('/:id')
  .get(getSeasonById)
  .put(protect, adminOnly, endSeason);

module.exports = router;