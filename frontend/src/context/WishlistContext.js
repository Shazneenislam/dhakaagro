// contexts/wishlistContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('💖 [WishlistContext] No token found, skipping wishlist fetch');
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      const data = await wishlistAPI.getWishlist();
      console.log('💖 [WishlistContext] Fetched wishlist:', data);
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchWishlist();
    }
  }, []);

  const addToWishlist = async (productId) => {
    try {
      await wishlistAPI.addToWishlist(productId);
      await fetchWishlist();
      toast.success('Added to wishlist');
    } catch (error) {
      toast.error(error.message || 'Failed to add to wishlist');
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistAPI.removeFromWishlist(productId);
      await fetchWishlist();
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error(error.message || 'Failed to remove from wishlist');
      throw error;
    }
  };

  const checkWishlist = async (productId) => {
    try {
      const response = await wishlistAPI.checkWishlist(productId);
      return response.isInWishlist;
    } catch (error) {
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    checkWishlist,
    isInWishlist,
    fetchWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};