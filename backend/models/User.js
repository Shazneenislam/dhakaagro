const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6
  },
  phone: {
    type: String,
    required: false
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add to cart
userSchema.methods.addToCart = async function(productId, quantity = 1) {
  try {
    const cartItemIndex = this.cart.findIndex(
      item => item.product && item.product.toString() === productId.toString()
    );

    if (cartItemIndex > -1) {
      this.cart[cartItemIndex].quantity += quantity;
    } else {
      this.cart.push({
        product: productId,
        quantity
      });
    }

    await this.save();
    return this.cart;
  } catch (error) {
    throw new Error(`Failed to add to cart: ${error.message}`);
  }
};

// Update cart item
userSchema.methods.updateCartItem = async function(productId, quantity) {
  try {
    const cartItemIndex = this.cart.findIndex(
      item => item.product && item.product.toString() === productId.toString()
    );

    if (cartItemIndex === -1) {
      throw new Error('Product not found in cart');
    }

    if (quantity < 1) {
      // Remove item if quantity is less than 1
      this.cart.splice(cartItemIndex, 1);
    } else {
      this.cart[cartItemIndex].quantity = quantity;
    }

    await this.save();
    return this.cart;
  } catch (error) {
    throw new Error(`Failed to update cart item: ${error.message}`);
  }
};

// Remove from cart
userSchema.methods.removeFromCart = async function(productId) {
  try {
    const initialLength = this.cart.length;
    this.cart = this.cart.filter(
      item => !item.product || item.product.toString() !== productId.toString()
    );
    
    if (this.cart.length === initialLength) {
      throw new Error('Product not found in cart');
    }

    await this.save();
    return this.cart;
  } catch (error) {
    throw new Error(`Failed to remove from cart: ${error.message}`);
  }
};

// Clear cart
userSchema.methods.clearCart = async function() {
  try {
    this.cart = [];
    await this.save();
    return this.cart;
  } catch (error) {
    throw new Error(`Failed to clear cart: ${error.message}`);
  }
};

module.exports = mongoose.model('User', userSchema);