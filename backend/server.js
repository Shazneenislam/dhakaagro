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

// Enable CORS for Render deployment
const allowedOrigins = [
  'http://localhost:3000',                    // Local development
  'https://dhakaagro.vercel.app',            // Vercel frontend
  'https://www.dhakaagro.vercel.app',        // Vercel www subdomain
  'https://dhakaagro.onrender.com',          // Render backend itself (for testing)
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) {
      console.log('🌐 No origin header (direct API call)');
      return callback(null, true);
    }
    
    console.log('🌐 Request origin:', origin);
    
    // Check if the origin is allowed
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed:', origin);
      return callback(null, true);
    }
    
    // For development, you might want to be more permissive
    if (process.env.NODE_ENV === 'development') {
      console.log('🟡 Development mode: Allowing origin:', origin);
      return callback(null, true);
    }
    
    console.log('❌ Origin not allowed:', origin);
    return callback(new Error(`Origin ${origin} not allowed by CORS policy`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests - FIXED: Use a proper route pattern
app.options(/.*/, cors(corsOptions));  // Changed from '*' to /.*/

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`🌐 [${new Date().toISOString()}] ${req.method} ${req.url} | Origin: ${req.headers.origin || 'No Origin'}`);
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
  const mountRoute = (routePath, router, name) => {
    console.log(`🔗 Mounting ${name} at ${routePath}`);
    app.use(routePath, router);
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

// Health check endpoint (required by Render for monitoring)
app.get('/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    cors: {
      allowedOrigins: allowedOrigins,
      currentOrigin: req.headers.origin || 'No origin header',
      environment: process.env.NODE_ENV || 'development'
    },
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
    server: 'DhakaAgro Backend',
    timestamp: new Date().toISOString(),
    cors: {
      origin: req.headers.origin || 'No origin header',
      allowed: allowedOrigins.includes(req.headers.origin || '')
    },
    endpoints: {
      getAllProducts: 'GET /api/products',
      getProduct: 'GET /api/products/:id',
      getCategories: 'GET /api/categories',
      health: 'GET /health',
      testCORS: 'GET /api/test-cors'
    }
  });
});

// CORS test endpoint
app.get('/api/test-cors', (req, res) => {
  console.log('🔄 CORS test requested');
  res.json({
    success: true,
    message: 'CORS is working correctly!',
    origin: req.headers.origin || 'No origin header',
    timestamp: new Date().toISOString(),
    allowedOrigins: allowedOrigins,
    yourOriginIsAllowed: allowedOrigins.includes(req.headers.origin || '')
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
      cors: {
        origin: req.headers.origin || 'No origin header'
      },
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
    cors: {
      origin: req.headers.origin || 'No origin header'
    },
    routes: routes
  });
});

// 404 handler
app.use((req, res, next) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.url}`,
    cors: {
      origin: req.headers.origin || 'No origin header'
    },
    availableRoutes: [
      'GET /api/products',
      'GET /api/categories',
      'GET /api/test',
      'GET /health',
      'GET /api/test-cors',
      'GET /api/test-products',
      'GET /api/routes'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.message);
  
  // Handle CORS errors specifically
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: err.message,
      allowedOrigins: allowedOrigins,
      yourOrigin: req.headers.origin || 'No origin header'
    });
  }
  
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error',
    cors: {
      origin: req.headers.origin || 'No origin header'
    },
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server started successfully!`);
  console.log(`✅ Port: ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ CORS enabled for origins:`, allowedOrigins);
  console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`\n📋 Available Endpoints:`);
  console.log(`   🔗 http://localhost:${PORT}/health`);
  console.log(`   🔗 http://localhost:${PORT}/api/test`);
  console.log(`   🔗 http://localhost:${PORT}/api/test-cors`);
  console.log(`   🔗 http://localhost:${PORT}/api/products`);
  console.log(`   🔗 http://localhost:${PORT}/api/categories`);
  console.log(`   🔗 http://localhost:${PORT}/api/test-products`);
  console.log(`\n🔍 Test these URLs in your browser or frontend!`);
});