// contexts/CartContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'; // Add useCallback
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

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
  const { isAuthenticated } = useAuth();

  // Wrap fetchCart in useCallback to memoize it and prevent infinite re-renders
  const fetchCart = useCallback(async () => {
    console.log('🛒 [CartContext] Fetching cart, authenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('🛒 [CartContext] User not authenticated, clearing cart');
      setCart({ items: [], total: 0, itemCount: 0 });
      return;
    }

    try {
      setLoading(true);
      const cartData = await cartAPI.getCart();
      console.log('🛒 [CartContext] Cart data received:', cartData);
      setCart(cartData);
    } catch (error) {
      console.error('❌ [CartContext] Error fetching cart:', error);
      setCart({ items: [], total: 0, itemCount: 0 });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]); // Add dependencies here

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], total: 0, itemCount: 0 });
    }
  }, [isAuthenticated, fetchCart]); // Add fetchCart to dependencies

  const addToCart = async (productId, quantity = 1) => {
  console.log('🛒 [CartContext] Adding to cart:', { productId, quantity });
  
  if (!isAuthenticated) {
    toast.error('Please login to add items to cart');
    throw new Error('User not authenticated');
  }

  try {
    const response = await cartAPI.addToCart({ productId, quantity });
    console.log('🛒 [CartContext] Add to cart response:', response);
    
    // Refresh cart data
    await fetchCart();
    
    toast.success('Added to cart');
    return response;
  } catch (error) {
    console.error('❌ [CartContext] Error adding to cart:', error);
    
    // More detailed error message
    let errorMessage = 'Failed to add to cart';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
    throw error;
  }
};

  const updateCartItem = async (productId, { quantity }) => {
    console.log('🛒 [CartContext] Updating cart item:', { productId, quantity });
    
    if (!isAuthenticated) {
      toast.error('Please login to update cart');
      throw new Error('User not authenticated');
    }

    try {
      const response = await cartAPI.updateCartItem(productId, { quantity });
      console.log('🛒 [CartContext] Update cart response:', response);
      
      // Fetch fresh cart data to ensure consistency
      await fetchCart();
      
      toast.success('Cart updated');
      return response;
    } catch (error) {
      console.error('❌ [CartContext] Error updating cart:', error);
      toast.error(error.message || 'Failed to update cart');
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    console.log('🛒 [CartContext] Removing from cart:', productId);
    
    if (!isAuthenticated) {
      toast.error('Please login to update cart');
      throw new Error('User not authenticated');
    }

    try {
      const response = await cartAPI.removeFromCart(productId);
      console.log('🛒 [CartContext] Remove from cart response:', response);
      
      // Update local state optimistically
      const itemToRemove = cart.items.find(item => item._id === productId);
      if (itemToRemove) {
        setCart(prev => ({
          ...prev,
          items: prev.items.filter(item => item._id !== productId),
          total: prev.total - (itemToRemove.price * itemToRemove.quantity),
          itemCount: prev.itemCount - itemToRemove.quantity
        }));
      }
      
      toast.success('Removed from cart');
      return response;
    } catch (error) {
      console.error('❌ [CartContext] Error removing from cart:', error);
      toast.error(error.message || 'Failed to remove item');
      throw error;
    }
  };

  const clearCart = async () => {
    console.log('🛒 [CartContext] Clearing cart');
    
    if (!isAuthenticated) {
      toast.error('Please login to update cart');
      throw new Error('User not authenticated');
    }

    try {
      const response = await cartAPI.clearCart();
      console.log('🛒 [CartContext] Clear cart response:', response);
      
      setCart({ items: [], total: 0, itemCount: 0 });
      toast.success('Cart cleared');
      return response;
    } catch (error) {
      console.error('❌ [CartContext] Error clearing cart:', error);
      toast.error(error.message || 'Failed to clear cart');
      throw error;
    }
  };

  const getCartItem = (productId) => {
    return cart.items.find(item => item._id === productId);
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