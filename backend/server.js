const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

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

// Route files
try {
  const authRoutes = require('./routes/authRoutes');
  const productRoutes = require('./routes/productRoutes');
  const cartRoutes = require('./routes/cartRoutes');
  const wishlistRoutes = require('./routes/wishlistRoutes');
  const categoryRoutes = require('./routes/categoryRoutes');
  const orderRoutes = require('./routes/orderRoutes');

  console.log('✅ Routes loaded successfully');

  const mountRoute = (path, router, name) => {
    console.log(`🔗 Mounting ${name} at ${path}`);
    app.use(path, router);
  };

  mountRoute('/api/auth', authRoutes, 'Auth Routes');
  mountRoute('/api/products', productRoutes, 'Product Routes');
  mountRoute('/api/cart', cartRoutes, 'Cart Routes');
  mountRoute('/api/wishlist', wishlistRoutes, 'Wishlist Routes');
  mountRoute('/api/categories', categoryRoutes, 'Category Routes');
  mountRoute('/api/orders', orderRoutes, 'Order Routes');

} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  process.exit(1);
}

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cors: {
      allowedOrigins: ['http://localhost:3000', 'https://dhakaagro.vercel.app']
    }
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('🧪 API test requested');
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    url: 'https://dhakaagro.onrender.com'
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.url}`,
    availableRoutes: ['/health', '/api/test', '/api/products', '/api/categories']
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server started successfully!`);
  console.log(`✅ Port: ${PORT}`);
  console.log(`✅ CORS enabled for: localhost:3000 and dhakaagro.vercel.app`);
  console.log(`✅ URL: https://dhakaagro.onrender.com`);
});