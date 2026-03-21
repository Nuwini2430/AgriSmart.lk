const Profile = require('../models/Profile');
const User = require('../models/User');

const createProfile = async (req, res) => {
  try {
    const { fullName, nicNumber, birthday, address, district, gender, email, bio } = req.body;
    
    let profile = await Profile.findOne({ user: req.user._id });
    
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { fullName, nicNumber, birthday, address, district, gender, email, bio },
        { new: true }
      );
    } else {
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
      await User.findByIdAndUpdate(req.user._id, { profileCompleted: true });
    }
    
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProfile, getProfile, updateProfile };