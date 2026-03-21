const express = require('express');
const router = express.Router();
const { getAllCrops, getCropById, createCrop, updateCrop, deleteCrop } = require('../controllers/cropController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.route('/')
  .get(getAllCrops)
  .post(protect, adminOnly, createCrop);

router.route('/:id')
  .get(getCropById)
  .put(protect, adminOnly, updateCrop)
  .delete(protect, adminOnly, deleteCrop);

module.exports = router;