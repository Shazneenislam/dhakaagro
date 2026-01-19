const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    console.log('🛒 [Backend] Getting cart for user:', req.user.id);
    
    const user = await User.findById(req.user.id).populate('cart.product');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate cart total
    let total = 0;
    const cartItems = user.cart.map(item => {
      if (!item.product) {
        return null;
      }
      
      const itemTotal = item.product.price * item.quantity;
      total += itemTotal;
      
      return {
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        originalPrice: item.product.originalPrice,
        discount: item.product.discount,
        image: item.product.images[0]?.url || '',
        quantity: item.quantity,
        stock: item.product.stock,
        itemTotal
      };
    }).filter(item => item !== null);

    console.log('🛒 [Backend] Cart items calculated:', cartItems.length);
    
    res.json({
      items: cartItems,
      total: parseFloat(total.toFixed(2)),
      itemCount: user.cart.reduce((acc, item) => acc + item.quantity, 0)
    });
  } catch (error) {
    console.error('❌ [Backend] Error in getCart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    console.log('🛒 [Backend] Adding to cart:', { productId, quantity, userId: req.user.id });
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: `Only ${product.stock} items available in stock` 
      });
    }

    const user = await User.findById(req.user.id);
    
    // Use the helper method from the User model
    await user.addToCart(productId, quantity);
    
    console.log('✅ [Backend] Product added to cart successfully');
    
    res.status(201).json({
      message: 'Product added to cart',
      success: true
    });
  } catch (error) {
    console.error('❌ [Backend] Error in addToCart:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to add to cart'
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ 
        message: `Only ${product.stock} items available in stock` 
      });
    }

    const user = await User.findById(req.user.id);
    
    // Use the helper method from the User model
    await user.updateCartItem(productId, quantity);
    
    res.json({
      message: 'Cart updated',
      success: true
    });
  } catch (error) {
    console.error('❌ [Backend] Error in updateCartItem:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to update cart'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    
    // Use the helper method from the User model
    await user.removeFromCart(productId);
    
    res.json({ 
      message: 'Product removed from cart',
      success: true 
    });
  } catch (error) {
    console.error('❌ [Backend] Error in removeFromCart:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to remove from cart'
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Use the helper method from the User model
    await user.clearCart();
    
    res.json({ 
      message: 'Cart cleared',
      success: true 
    });
  } catch (error) {
    console.error('❌ [Backend] Error in clearCart:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to clear cart'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};