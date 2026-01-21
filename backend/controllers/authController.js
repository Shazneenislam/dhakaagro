const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-for-development';
  const expire = process.env.JWT_EXPIRE || '30d';
  
  console.log('🔑 Generating token with:', {
    hasSecret: !!process.env.JWT_SECRET,
    expire: expire
  });
  
  return jwt.sign({ id }, secret, { expiresIn: expire });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    console.log('📝 Register request:', { 
      email: req.body.email,
      name: req.body.name 
    });
    
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    console.log('🔐 Login attempt:', { 
      email: req.body.email,
      hasPassword: !!req.body.password 
    });
    
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }
    
    // Check for user email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    const token = generateToken(user._id);
    
    console.log('✅ Login successful:', email);
    
    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      token
    });
    
  } catch (error) {
    console.error('🔥 Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      
      if (req.body.address) {
        user.address = { ...user.address, ...req.body.address };
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        avatar: updatedUser.avatar
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Create test user
// @route   POST /api/auth/create-test
// @access  Public
exports.createTestUser = async (req, res) => {
  try {
    console.log('👤 Creating test user...');
    
    const testEmail = 'test@example.com';
    const existingUser = await User.findOne({ email: testEmail });
    
    if (existingUser) {
      return res.json({
        success: true,
        message: 'Test user already exists',
        user: {
          id: existingUser._id,
          email: existingUser.email
        },
        credentials: {
          email: testEmail,
          password: 'password123'
        }
      });
    }
    
    const user = await User.create({
      name: 'Test User',
      email: testEmail,
      password: 'password123',
      phone: '1234567890'
    });
    
    res.json({
      success: true,
      message: 'Test user created',
      credentials: {
        email: testEmail,
        password: 'password123'
      }
    });
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
};