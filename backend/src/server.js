const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
// const seedAdmin = require('./utils/seedAdmin'); // REMOVE THIS LINE

dotenv.config();

connectDB();

// Seed admin user
// seedAdmin(); // REMOVE THIS LINE

const app = express();

// ========== CORS Configuration ==========
// Allowed origins for production and development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5000',
  'http://localhost:5004',
  'https://agrismart.lk',
  'https://www.agrismart.lk',
  'https://agrismart.vercel.app',
  'https://agrismart-blond.vercel.app',
  'https://agrismart-marketing.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

// CORS middleware with better error handling
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For development, allow all origins (temporary fix)
      if (process.env.NODE_ENV !== 'production') {
        console.log('CORS: Allowing development origin:', origin);
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========== Routes ==========
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/seasons', require('./routes/seasonRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/farmers', require('./routes/farmerRoutes'));

// ========== Health Check ==========
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ========== Root Route ==========
app.get('/', (req, res) => {
  res.json({ 
    message: 'AgriSmart API is running',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      crops: '/api/crops',
      seasons: '/api/seasons',
      registrations: '/api/registrations',
      farmers: '/api/farmers'
    }
  });
});

// ========== 404 Handler ==========
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ========== Error Handler ==========
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});