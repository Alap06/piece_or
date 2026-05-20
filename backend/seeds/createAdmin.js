require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const ensureAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const admin = await User.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@mahdia.tn',
        passwordHash: process.env.ADMIN_PASSWORD || 'Admin@2026',
        role: 'admin',
        isActive: true,
      });
      console.log('✅ Admin account created:', admin.email);
    } else {
      console.log('ℹ️  Admin already exists:', existingAdmin.email);
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
};

// Run standalone
if (require.main === module) {
  const connectDB = require('../config/db');
  connectDB().then(async () => {
    await ensureAdmin();
    mongoose.connection.close();
  });
}

module.exports = { ensureAdmin };
