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

router.post('/', protect, registerCrop);
router.get('/my', protect, getMyRegistrations);
router.get('/', protect, adminOnly, getAllRegistrations);
router.get('/:id', protect, getRegistrationById);
router.put('/:id/approve', protect, adminOnly, approveRegistration);
router.put('/:id/reject', protect, adminOnly, rejectRegistration);
router.put('/:id/complete', protect, completeRegistration);
router.put('/:id', protect, updateRegistration);
router.delete('/:id', protect, adminOnly, deleteRegistration);

module.exports = router;