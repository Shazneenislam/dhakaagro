const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    if (user) {
      const token = generateToken(user._id);
      
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    console.log('🔍 [Backend] Looking for user:', email);
    
    // Check for user email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ [Backend] User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('✅ [Backend] User found:', { id: user._id, email: user.email });
    
    // Check if password matches
    console.log('🔑 [Backend] Checking password...');
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      console.log('❌ [Backend] Password mismatch for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
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
    
    res.status(500).json({ 
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
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        avatar: updatedUser.avatar
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};