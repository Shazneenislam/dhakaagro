const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
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
  // Import routes
  const authRoutes = require('./routes/authRoutes');
  const productRoutes = require('./routes/productRoutes');
  const cartRoutes = require('./routes/cartRoutes');
  const wishlistRoutes = require('./routes/wishlistRoutes');
  const categoryRoutes = require('./routes/categoryRoutes');
  const orderRoutes = require('./routes/orderRoutes');

  console.log('✅ Routes loaded successfully');

  // Mount routers with logging
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
  console.error('Full error:', error);
  process.exit(1);
}

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    routes: {
      products: '/api/products',
      categories: '/api/categories',
      auth: '/api/auth',
      cart: '/api/cart',
      wishlist: '/api/wishlist',
      orders: '/api/orders'
    }
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  console.log('🧪 API test requested');
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      getAllProducts: 'GET /api/products',
      getProduct: 'GET /api/products/:id',
      getCategories: 'GET /api/categories',
      health: 'GET /health'
    }
  });
});

// Test product endpoint directly
app.get('/api/test-products', async (req, res) => {
  console.log('🧪 Test products endpoint');
  try {
    // Try to get products directly from database for testing
    const Product = require('./models/Product');
    const products = await Product.find().limit(5);
    
    res.json({
      success: true,
      count: products.length,
      products: products.map(p => ({
        id: p._id,
        name: p.name,
        price: p.price,
        category: p.category
      }))
    });
  } catch (error) {
    console.error('Error in test-products:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Route to list all available routes
app.get('/api/routes', (req, res) => {
  const routes = [];
  
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on app
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      // Routes added via router
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: middleware.regexp.toString().replace('/^', '').replace('\\/?(?=\\/|$)/i', '') + handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  
  res.json({
    success: true,
    routes: routes
  });
});

// 404 handler
app.use((req, res, next) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.url}`,
    availableRoutes: [
      'GET /api/products',
      'GET /api/categories',
      'GET /api/test',
      'GET /health'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server started successfully!`);
  console.log(`✅ Port: ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n📋 Available Endpoints:`);
  console.log(`   🔗 http://localhost:${PORT}/health`);
  console.log(`   🔗 http://localhost:${PORT}/api/test`);
  console.log(`   🔗 http://localhost:${PORT}/api/products`);
  console.log(`   🔗 http://localhost:${PORT}/api/categories`);
  console.log(`   🔗 http://localhost:${PORT}/api/test-products`);
  console.log(`\n🔍 Test these URLs in your browser first!`);
});