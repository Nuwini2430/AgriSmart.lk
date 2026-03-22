const express = require('express');
const router = express.Router();
const { 
  registerCrop, 
  getMyRegistrations, 
  getAllRegistrations, 
  approveRegistration, 
  rejectRegistration 
} = require('../controllers/registrationController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.route('/')
  .post(protect, registerCrop)
  .get(protect, adminOnly, getAllRegistrations);

router.get('/my', protect, getMyRegistrations);

router.route('/:id/approve')
  .put(protect, adminOnly, approveRegistration);

router.route('/:id/reject')
  .put(protect, adminOnly, rejectRegistration);

module.exports = router;