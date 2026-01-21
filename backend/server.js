const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://dhakaagro.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`🌐 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('📦 Request body:', req.body);
  }
  next();
});

// Import routes
console.log('\n📦 Loading routes...\n');

// Load modular routes
try {
  const authRoutes = require('./routes/authRoutes');
  const productRoutes = require('./routes/productRoutes');
  const cartRoutes = require('./routes/cartRoutes');
  const wishlistRoutes = require('./routes/wishlistRoutes');
  const categoryRoutes = require('./routes/categoryRoutes');
  const orderRoutes = require('./routes/orderRoutes');

  // Mount routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/wishlist', wishlistRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/orders', orderRoutes);

  console.log('✅ All routes loaded successfully!');
} catch (error) {
  console.error('❌ Error loading routes:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: 'Connected',
    service: 'DhakaAgro API'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/create-test',
      '/api/products',
      '/api/categories'
    ]
  });
});

// Create test user endpoint (for debugging)
app.post('/api/auth/create-test', async (req, res) => {
  try {
    console.log('👤 Creating test user...');
    const User = require('./models/User');
    
    // Check if test user exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      return res.json({
        success: true,
        message: 'Test user already exists',
        user: {
          id: existingUser._id,
          email: existingUser.email
        },
        credentials: {
          email: 'test@example.com',
          password: 'password123'
        }
      });
    }
    
    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890'
    });
    
    res.json({
      success: true,
      message: 'Test user created',
      credentials: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'DhakaAgro API Server',
    version: '1.0.0',
    status: 'Running',
    health: '/health',
    test: '/api/test',
    endpoints: [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/create-test',
      '/api/products',
      '/api/categories',
      '/api/cart',
      '/api/wishlist',
      '/api/orders'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.url}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server started successfully!`);
  console.log(`✅ Port: ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ URL: https://dhakaagro.onrender.com`);
  console.log(`✅ MongoDB: Connected`);
  console.log(`\n🔗 Health check: https://dhakaagro.onrender.com/health`);
  console.log(`🔗 Test endpoint: https://dhakaagro.onrender.com/api/test`);
});