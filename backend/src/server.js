const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const seedAdmin = require('./utils/seedAdmin');

dotenv.config();

connectDB();

// Seed admin user
seedAdmin();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/seasons', require('./routes/seasonRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/farmers', require('./routes/farmerRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'AgriSmart API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});