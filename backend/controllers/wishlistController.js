// controllers/wishlistController.js
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    console.log('💖 [Backend] Getting wishlist for user:', req.user.id);
    
    const user = await User.findById(req.user.id)
      .populate('wishlist', 'name price originalPrice discount images stock slug')
      .select('wishlist');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    console.log('💖 [Backend] Wishlist retrieved:', user.wishlist.length, 'items');
    
    res.json({
      success: true,
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('❌ [Backend] Error in getWishlist:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    console.log('💖 [Backend] Adding to wishlist:', { 
      userId: req.user.id,
      productId: productId 
    });
    
    if (!productId) {
      return res.status(400).json({ 
        success: false,
        message: 'Product ID is required' 
      });
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Check if product already in wishlist
    const isInWishlist = user.wishlist.includes(productId);
    
    if (isInWishlist) {
      return res.status(400).json({ 
        success: false,
        message: 'Product already in wishlist' 
      });
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();
    
    console.log('✅ [Backend] Product added to wishlist:', product.name);
    
    res.status(201).json({
      success: true,
      message: 'Product added to wishlist'
    });
  } catch (error) {
    console.error('❌ [Backend] Error in addToWishlist:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to add to wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    console.log('💖 [Backend] Removing from wishlist:', { 
      userId: req.user.id,
      productId: productId 
    });

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    const wishlistIndex = user.wishlist.findIndex(
      id => id.toString() === productId
    );

    if (wishlistIndex > -1) {
      user.wishlist.splice(wishlistIndex, 1);
    } else {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found in wishlist' 
      });
    }

    await user.save();
    
    console.log('✅ [Backend] Product removed from wishlist');
    
    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    console.error('❌ [Backend] Error in removeFromWishlist:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to remove from wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
exports.checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    console.log('💖 [Backend] Checking wishlist for product:', { 
      userId: req.user.id,
      productId: productId 
    });

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    const isInWishlist = user.wishlist.includes(productId);
    
    res.json({
      success: true,
      isInWishlist: isInWishlist
    });
  } catch (error) {
    console.error('❌ [Backend] Error in checkWishlist:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to check wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};