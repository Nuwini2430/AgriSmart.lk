const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        phoneNumber: '0712345678',
        password: hashedPassword,
        role: 'admin',
        profileCompleted: true
      });
      console.log('✅ Admin user created');
      console.log('   Phone: 0712345678');
      console.log('   Password: admin123');
    } else {
      console.log('⚠️ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
};

module.exports = seedAdmin;