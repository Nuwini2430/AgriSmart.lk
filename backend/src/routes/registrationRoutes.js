const express = require('express');
const router = express.Router();
const { 
  registerCrop, 
  getMyRegistrations, 
  getAllRegistrations,
  getRegistrationById,
  approveRegistration, 
  rejectRegistration,
  completeRegistration,
  updateRegistration,
  deleteRegistration
} = require('../controllers/registrationController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// @route   POST /api/registrations - Register for a crop (Farmer)
// @route   GET /api/registrations - Get all registrations (Admin)
router.route('/')
  .post(protect, registerCrop)
  .get(protect, adminOnly, getAllRegistrations);

// @route   GET /api/registrations/my - Get my registrations (Farmer)
router.get('/my', protect, getMyRegistrations);

// @route   GET /api/registrations/:id - Get registration by ID (Farmer/Admin)
router.get('/:id', protect, getRegistrationById);

// @route   PUT /api/registrations/:id/approve - Approve registration (Admin)
router.put('/:id/approve', protect, adminOnly, approveRegistration);

// @route   PUT /api/registrations/:id/reject - Reject registration (Admin)
router.put('/:id/reject', protect, adminOnly, rejectRegistration);

// @route   PUT /api/registrations/:id/complete - Complete season (Farmer)
router.put('/:id/complete', protect, completeRegistration);

// @route   PUT /api/registrations/:id - Update registration (Farmer/Admin)
router.put('/:id', protect, updateRegistration);

// @route   DELETE /api/registrations/:id - Delete registration (Admin)
router.delete('/:id', protect, adminOnly, deleteRegistration);

module.exports = router;