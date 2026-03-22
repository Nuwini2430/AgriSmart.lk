const express = require('express');
const router = express.Router();
const { getAllFarmers, getFarmerById } = require('../controllers/farmerController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/', protect, adminOnly, getAllFarmers);
router.get('/:id', protect, adminOnly, getFarmerById);

module.exports = router;