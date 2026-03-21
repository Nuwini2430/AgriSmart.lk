const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== ROUTES ==========

// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Profile Routes
app.use('/api/profile', require('./routes/profileRoutes'));

// Crop Routes
app.use('/api/crops', require('./routes/cropRoutes'));

// Season Routes (to be added)
// app.use('/api/seasons', require('./routes/seasonRoutes'));

// Registration Routes (to be added)
// app.use('/api/registrations', require('./routes/registrationRoutes'));

// Farmer Routes (to be added)
// app.use('/api/farmers', require('./routes/farmerRoutes'));

// ========== TEST ROUTE ==========
app.get('/', (req, res) => {
  res.json({ 
    message: 'AgriSmart API is running',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      crops: '/api/crops'
    }
  });
});

// ========== ERROR HANDLING ==========
// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
});