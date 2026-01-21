// controllers/cartController.js
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    console.log('🛒 [Backend] Getting cart for user:', req.user.id);
    
    const user = await User.findById(req.user.id)
      .populate('cart.product', 'name price originalPrice discount images stock slug category')
      .select('cart');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Calculate cart totals
    let total = 0;
    let itemCount = 0;
    
    const cartItems = user.cart.map(item => {
      if (!item.product) {
        return null;
      }
      
      const product = item.product;
      const quantity = item.quantity || 1;
      const price = product.price || 0;
      const itemTotal = price * quantity;
      
      total += itemTotal;
      itemCount += quantity;
      
      return {
        _id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        image: product.images?.[0]?.url || '',
        quantity: quantity,
        stock: product.stock || 0,
        slug: product.slug,
        category: product.category,
        itemTotal: parseFloat(itemTotal.toFixed(2))
      };
    }).filter(item => item !== null);

    console.log('🛒 [Backend] Cart calculated:', {
      items: cartItems.length,
      total: total,
      itemCount: itemCount
    });
    
    res.json({
      success: true,
      items: cartItems,
      total: parseFloat(total.toFixed(2)),
      itemCount: itemCount
    });
  } catch (error) {
    console.error('❌ [Backend] Error in getCart:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    console.log('🛒 [Backend] Adding to cart:', { 
      userId: req.user.id,
      productId: productId,
      quantity: quantity 
    });
    
    // Validate input
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
    
    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false,
        message: `Only ${product.stock} items available in stock` 
      });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Check if product already in cart
    const cartItemIndex = user.cart.findIndex(
      item => item.product && item.product.toString() === productId
    );
    
    if (cartItemIndex > -1) {
      // Update quantity
      user.cart[cartItemIndex].quantity += quantity;
      
      // Check stock again with new quantity
      if (product.stock < user.cart[cartItemIndex].quantity) {
        return res.status(400).json({ 
          success: false,
          message: `Only ${product.stock} items available in stock` 
        });
      }
    } else {
      // Add new item to cart
      user.cart.push({
        product: productId,
        quantity: quantity
      });
    }
    
    // LINE 149: This triggers the pre-save middleware in User.js
    await user.save(); // <-- LINE 149
    
    console.log('✅ [Backend] Product added to cart:', product.name);
    
    // Send minimal response
    res.status(201).json({
      success: true,
      message: 'Product added to cart'
    });
  } catch (error) {
    console.error('❌ [Backend] Error in addToCart:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to add to cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    
    console.log('🛒 [Backend] Updating cart item:', { 
      userId: req.user.id,
      productId: productId,
      quantity: quantity 
    });
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false,
        message: 'Quantity must be at least 1' 
      });
    }
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false,
        message: `Only ${product.stock} items available in stock` 
      });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    const cartItemIndex = user.cart.findIndex(
      item => item.product && item.product.toString() === productId
    );
    
    if (cartItemIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found in cart' 
      });
    }
    
    // Update quantity
    user.cart[cartItemIndex].quantity = quantity;
    
    await user.save();
    
    console.log('✅ [Backend] Cart updated:', product.name);
    
    res.json({
      success: true,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('❌ [Backend] Error in updateCartItem:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    console.log('🛒 [Backend] Removing from cart:', { 
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
    
    const initialLength = user.cart.length;
    user.cart = user.cart.filter(
      item => !item.product || item.product.toString() !== productId
    );
    
    if (user.cart.length === initialLength) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found in cart' 
      });
    }
    
    await user.save();
    
    console.log('✅ [Backend] Product removed from cart');
    
    res.json({
      success: true,
      message: 'Product removed from cart'
    });
  } catch (error) {
    console.error('❌ [Backend] Error in removeFromCart:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to remove from cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    console.log('🛒 [Backend] Clearing cart for user:', req.user.id);
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    user.cart = [];
    await user.save();
    
    console.log('✅ [Backend] Cart cleared');
    
    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('❌ [Backend] Error in clearCart:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to clear cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get cart count
// @route   GET /api/cart/count
// @access  Private
exports.getCartCount = async (req, res) => {
  try {
    console.log('🛒 [Backend] Getting cart count for user:', req.user.id);
    
    const user = await User.findById(req.user.id).select('cart');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    const itemCount = user.cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    res.json({
      success: true,
      itemCount: itemCount
    });
  } catch (error) {
    console.error('❌ [Backend] Error in getCartCount:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get cart count',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Merge cart (for guest to logged in user)
// @route   POST /api/cart/merge
// @access  Private
exports.mergeCart = async (req, res) => {
  try {
    const { items } = req.body;
    
    console.log('🛒 [Backend] Merging cart for user:', req.user.id);
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid cart items' 
      });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Merge guest cart with user cart
    for (const item of items) {
      if (!item.productId || !item.quantity) continue;
      
      const cartItemIndex = user.cart.findIndex(
        cartItem => cartItem.product && cartItem.product.toString() === item.productId
      );
      
      if (cartItemIndex > -1) {
        // Update quantity
        user.cart[cartItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        user.cart.push({
          product: item.productId,
          quantity: item.quantity
        });
      }
    }
    
    await user.save();
    
    console.log('✅ [Backend] Cart merged successfully');
    
    res.json({
      success: true,
      message: 'Cart merged successfully'
    });
  } catch (error) {
    console.error('❌ [Backend] Error in mergeCart:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to merge cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};