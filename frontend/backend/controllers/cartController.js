const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate cart total
    let total = 0;
    const cartItems = user.cart.map(item => {
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
    });

    res.json({
      items: cartItems,
      total: parseFloat(total.toFixed(2)),
      itemCount: user.cart.reduce((acc, item) => acc + item.quantity, 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
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
    
    // Check if product already in cart
    const cartItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      // Update quantity if already in cart
      user.cart[cartItemIndex].quantity += quantity;
      
      if (user.cart[cartItemIndex].quantity > product.stock) {
        return res.status(400).json({ 
          message: `Cannot add more than ${product.stock} items` 
        });
      }
    } else {
      // Add new item to cart
      user.cart.push({
        product: productId,
        quantity
      });
    }

    await user.save();
    
    const populatedUser = await User.findById(req.user.id).populate('cart.product');
    
    res.status(201).json({
      message: 'Product added to cart',
      cart: populatedUser.cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartItem = async (req, res) => {
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
    
    const cartItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        user.cart.splice(cartItemIndex, 1);
      } else {
        // Update quantity
        user.cart[cartItemIndex].quantity = quantity;
      }
    } else {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    await user.save();
    
    const populatedUser = await User.findById(req.user.id).populate('cart.product');
    
    res.json({
      message: 'Cart updated',
      cart: populatedUser.cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    
    const cartItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      user.cart.splice(cartItemIndex, 1);
    } else {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    await user.save();
    
    res.json({ message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};