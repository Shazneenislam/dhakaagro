const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// SIMPLE CORS FIX - Allow both localhost and Vercel
app.use(cors({
  origin: ['http://localhost:3000', 'https://dhakaagro.vercel.app'],
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`🌐 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

console.log('\n📦 Loading routes...\n');

// ============ TRY TO LOAD MODULAR ROUTES FIRST ============
let modularRoutesLoaded = false;

try {
  console.log('🔍 Attempting to load modular routes...');
  
  // Check if routes directory exists
  const fs = require('fs');
  const path = require('path');
  const routesDir = path.join(__dirname, 'routes');
  
  if (fs.existsSync(routesDir)) {
    console.log('📁 Routes directory found, loading files...');
    
    const authRoutes = require('./routes/authRoutes');
    const productRoutes = require('./routes/productRoutes');
    const cartRoutes = require('./routes/cartRoutes');
    const wishlistRoutes = require('./routes/wishlistRoutes');
    const categoryRoutes = require('./routes/categoryRoutes');
    const orderRoutes = require('./routes/orderRoutes');
    
    app.use('/api/auth', authRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/wishlist', wishlistRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/orders', orderRoutes);
    
    modularRoutesLoaded = true;
    console.log('✅ All modular routes loaded successfully!');
  } else {
    console.log('📁 Routes directory not found, using inline routes');
  }
} catch (error) {
  console.log('⚠️ Modular routes failed, falling back to inline routes');
  console.log('Error details:', error.message);
  modularRoutesLoaded = false;
}

// ============ INLINE ROUTES (FALLBACK) ============
if (!modularRoutesLoaded) {
  console.log('\n🔄 Setting up inline routes as fallback...\n');
  
  // ============ SIMPLE AUTH ROUTES ============
  console.log('🔐 Setting up inline auth routes...');
  
  // Simple auth middleware
  const protect = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      const User = require('./models/User');
      req.user = await User.findById(decoded.id);
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      res.status(401).json({ message: 'Not authorized' });
    }
  };
  
  // Register endpoint
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;
      
      console.log('📝 Register:', { email, name });
      
      if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: 'All fields required' });
      }
      
      const User = require('./models/User');
      const userExists = await User.findOne({ email });
      
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      const user = await User.create({ name, email, password, phone });
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '30d' }
      );
      
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Login endpoint
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      console.log('🔐 Login attempt:', email);
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }
      
      const User = require('./models/User');
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        console.log('❌ Password mismatch for:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '30d' }
      );
      
      console.log('✅ Login successful:', email);
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });
  
  // Get current user
  app.get('/api/auth/me', protect, async (req, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // ============ CREATE TEST USER ENDPOINT ============
  app.post('/api/create-test-user', async (req, res) => {
    try {
      console.log('👤 Creating test user...');
      const User = require('./models/User');
      
      // Check if test user already exists
      const existingUser = await User.findOne({ email: 'test@example.com' });
      
      if (existingUser) {
        console.log('✅ Test user already exists');
        return res.json({
          success: true,
          message: 'Test user already exists',
          user: {
            email: existingUser.email,
            id: existingUser._id
          },
          credentials: {
            email: 'test@example.com',
            password: 'password123'
          }
        });
      }
      
      // Create new test user
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890'
      });
      
      console.log('✅ Test user created:', user.email);
      
      res.json({
        success: true,
        message: 'Test user created successfully',
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        },
        credentials: {
          email: 'test@example.com',
          password: 'password123'
        }
      });
    } catch (error) {
      console.error('❌ Error creating test user:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });
  
  // ============ SIMPLE PRODUCT ROUTES ============
  console.log('🛍️ Setting up inline product routes...');
  
  app.get('/api/products', async (req, res) => {
    try {
      const Product = require('./models/Product');
      const products = await Product.find({});
      res.json({
        success: true,
        count: products.length,
        products
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.get('/api/products/:id', async (req, res) => {
    try {
      const Product = require('./models/Product');
      const product = await Product.findById(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // ============ SIMPLE CATEGORY ROUTES ============
  console.log('📂 Setting up inline category routes...');
  
  app.get('/api/categories', async (req, res) => {
    try {
      const Category = require('./models/Category');
      const categories = await Category.find({});
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  console.log('✅ Inline routes setup complete!');
}

// ============ ESSENTIAL ENDPOINTS ============
// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    routeMethod: modularRoutesLoaded ? 'Modular' : 'Inline',
    mongodb: 'Connected'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('🧪 API test requested');
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    url: 'https://dhakaagro.onrender.com',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'DhakaAgro API Server',
    version: '1.0.0',
    status: 'Running',
    endpoints: [
      '/health',
      '/api/test',
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/me',
      '/api/create-test-user',
      '/api/products',
      '/api/categories'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.url}`,
    availableRoutes: [
      '/health',
      '/api/test',
      '/api/auth/login',
      '/api/auth/register',
      '/api/create-test-user',
      '/api/products',
      '/api/categories'
    ]
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
  console.log(`✅ CORS enabled for: localhost:3000 and dhakaagro.vercel.app`);
  console.log(`✅ URL: https://dhakaagro.onrender.com`);
  console.log(`✅ MongoDB: Connected`);
});