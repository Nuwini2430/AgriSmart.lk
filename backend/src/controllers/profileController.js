const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc    Create profile
// @route   POST /api/profile
const createProfile = async (req, res) => {
  try {
    const { fullName, nicNumber, birthday, address, district, gender, email, bio } = req.body;
    
    // Check if profile already exists
    let profile = await Profile.findOne({ user: req.user._id });
    
    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { fullName, nicNumber, birthday, address, district, gender, email, bio },
        { new: true }
      );
    } else {
      // Create new profile
      profile = await Profile.create({
        user: req.user._id,
        fullName,
        nicNumber,
        birthday,
        address,
        district,
        gender,
        email,
        bio
      });
      
      // Update user profileCompleted status
      await User.findByIdAndUpdate(req.user._id, { profileCompleted: true });
    }
    
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/profile
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update profile
// @route   PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload profile picture
// @route   POST /api/profile/upload
const uploadProfilePicture = async (req, res) => {
  try {
    const { image } = req.body;
    
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { profilePicture: image },
      { new: true }
    );
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json({ profilePicture: profile.profilePicture });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProfile, getProfile, updateProfile, uploadProfilePicture };