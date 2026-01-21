const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-for-development';
  const expire = process.env.JWT_EXPIRE || '30d';
  
  console.log('🔑 [Backend] Generating token:', {
    hasSecret: !!process.env.JWT_SECRET,
    expire: expire
  });
  
  return jwt.sign({ id }, secret, { expiresIn: expire });
};

// @desc    Create test user
// @route   POST /api/auth/create-test
// @access  Public
exports.createTestUser = async (req, res) => {
  try {
    console.log('👤 [Backend] Creating test user...');
    
    const testEmail = 'test@example.com';
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: testEmail });
    
    if (existingUser) {
      console.log('✅ [Backend] Test user already exists');
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
    
    // Create new test user
    const user = await User.create({
      name: 'Test User',
      email: testEmail,
      password: 'password123',
      phone: '1234567890'
    });
    
    console.log('✅ [Backend] Test user created:', user.email);
    
    res.json({
      success: true,
      message: 'Test user created successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      credentials: {
        email: testEmail,
        password: 'password123'
      }
    });
  } catch (error) {
    console.error('❌ [Backend] Error creating test user:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    console.log('📝 [Backend] Register request received:', { 
      email: req.body.email,
      name: req.body.name 
    });
    
    const { name, email, password, phone } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide name, email and password' 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('❌ [Backend] User already exists:', email);
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    console.log('👤 [Backend] Creating new user...');
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || ''
    });

    console.log('✅ [Backend] User created:', user.email);
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token
    });
    
  } catch (error) {
    console.error('❌ [Backend] Register error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    console.log('🔐 [Backend] Login attempt received:', { 
      email: req.body.email,
      hasPassword: !!req.body.password,
      timestamp: new Date().toISOString()
    });
    
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      console.log('❌ [Backend] Missing email or password');
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }
    
    console.log('🔍 [Backend] Looking for user:', email);
    
    // Check for user email - MUST include password with select('+password')
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ [Backend] User not found:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    console.log('✅ [Backend] User found:', { 
      id: user._id, 
      email: user.email,
      hasPasswordField: !!user.password,
      passwordStartsWith: user.password ? user.password.substring(0, 10) + '...' : 'no password'
    });
    
    // Check if password matches - with multiple fallback methods
    let isMatch = false;
    
    // Method 1: Try matchPassword method if it exists
    if (typeof user.matchPassword === 'function') {
      console.log('🔑 [Backend] Using matchPassword method');
      try {
        isMatch = await user.matchPassword(password);
      } catch (methodError) {
        console.error('❌ [Backend] matchPassword method error:', methodError);
      }
    }
    
    // Method 2: Try direct bcrypt compare if matchPassword failed or doesn't exist
    if (!isMatch && user.password) {
      console.log('🔑 [Backend] Using direct bcrypt compare');
      try {
        // Check if password is already hashed (bcrypt hashes start with $2b$)
        if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
          isMatch = await bcrypt.compare(password, user.password);
        } else {
          // Password might be stored in plain text (for testing)
          console.warn('⚠️ [Backend] Password appears to be in plain text');
          isMatch = (password === user.password);
        }
      } catch (bcryptError) {
        console.error('❌ [Backend] Bcrypt compare error:', bcryptError);
      }
    }
    
    if (!isMatch) {
      console.log('❌ [Backend] Password mismatch for user:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    console.log('✅ [Backend] Password verified successfully');
    
    // Generate token
    console.log('🎫 [Backend] Generating JWT token...');
    const token = generateToken(user._id);
    
    console.log('✅ [Backend] Login successful:', { 
      userId: user._id, 
      email: user.email,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: 'Login successful',
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      token
    });
    
  } catch (error) {
    console.error('🔥 [Backend] Login error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString()
    });
    
    // Handle specific errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(500).json({ 
        success: false,
        message: 'JWT configuration error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired' 
      });
    }
    
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
    console.log('👤 [Backend] Getting current user:', req.user.id);
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        address: user.address,
        wishlist: user.wishlist,
        cart: user.cart,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('❌ [Backend] GetMe error:', error);
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
    console.log('📝 [Backend] Update profile for user:', req.user.id);
    
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
    // Update address if provided
    if (req.body.address) {
      user.address = { ...user.address, ...req.body.address };
    }

    // Update avatar if provided
    if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    const updatedUser = await user.save();

    console.log('✅ [Backend] Profile updated:', updatedUser.email);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        avatar: updatedUser.avatar
      }
    });
  } catch (error) {
    console.error('❌ [Backend] Update profile error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    console.log('🔐 [Backend] Changing password for user:', req.user.id);
    
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Check current password
    let isMatch = false;
    if (typeof user.matchPassword === 'function') {
      isMatch = await user.matchPassword(currentPassword);
    } else if (user.password) {
      if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
        isMatch = await bcrypt.compare(currentPassword, user.password);
      } else {
        isMatch = (currentPassword === user.password);
      }
    }
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    console.log('✅ [Backend] Password changed for:', user.email);
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('❌ [Backend] Change password error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    console.log('👥 [Backend] Getting all users');
    
    const users = await User.find({}).select('-password');
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('❌ [Backend] Get users error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    await user.deleteOne();
    
    console.log('🗑️ [Backend] User deleted:', user.email);
    
    res.json({
      success: true,
      message: 'User removed'
    });
  } catch (error) {
    console.error('❌ [Backend] Delete user error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Debug endpoint - Check user data
// @route   GET /api/auth/debug/:email
// @access  Public (for debugging)
exports.debugUser = async (req, res) => {
  try {
    const { email } = req.params;
    
    console.log('🔍 [Backend] Debugging user:', email);
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found',
        email: email
      });
    }
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0,
        passwordPrefix: user.password ? user.password.substring(0, 30) + '...' : null,
        passwordIsHashed: user.password ? (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) : false,
        hasMatchPassword: typeof user.matchPassword === 'function',
        methods: Object.getOwnPropertyNames(Object.getPrototypeOf(user))
      }
    });
  } catch (error) {
    console.error('❌ [Backend] Debug error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};