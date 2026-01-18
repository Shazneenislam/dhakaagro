// contexts/cartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    total: 0,
    itemCount: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartAPI.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartAPI.addToCart({ productId, quantity });
      await fetchCart();
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      await cartAPI.updateCartItem(productId, { quantity });
      await fetchCart();
      toast.success('Cart updated');
    } catch (error) {
      toast.error(error.message || 'Failed to update cart');
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartAPI.removeFromCart(productId);
      await fetchCart();
      toast.success('Removed from cart');
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart({ items: [], total: 0, itemCount: 0 });
      toast.success('Cart cleared');
    } catch (error) {
      toast.error(error.message || 'Failed to clear cart');
      throw error;
    }
  };

  const getCartItem = (productId) => {
    return cart.items.find(item => item.product?._id === productId);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItem,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};