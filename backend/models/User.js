// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    minlength: 6,
    select: false
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
  avatar: {
    type: String,
    default: '/uploads/default-avatar.png'
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
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ============ PASSWORD HANDLING ============

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password was modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    throw new Error('Password comparison failed');
  }
};

// ============ SIMPLIFIED CART METHODS ============

userSchema.methods.addToCart = function(productId, quantity = 1) {
  const cartItemIndex = this.cart.findIndex(
    item => item.product && item.product.toString() === productId.toString()
  );
  
  if (cartItemIndex > -1) {
    this.cart[cartItemIndex].quantity += quantity;
  } else {
    this.cart.push({ product: productId, quantity });
  }
  
  return this.save();
};

userSchema.methods.updateCartItem = function(productId, quantity) {
  const cartItemIndex = this.cart.findIndex(
    item => item.product && item.product.toString() === productId.toString()
  );
  
  if (cartItemIndex > -1) {
    if (quantity <= 0) {
      this.cart.splice(cartItemIndex, 1);
    } else {
      this.cart[cartItemIndex].quantity = quantity;
    }
  }
  
  return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
  this.cart = this.cart.filter(
    item => !item.product || item.product.toString() !== productId.toString()
  );
  
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = [];
  return this.save();
};

module.exports = mongoose.model('User', userSchema);