import React, { useState, useEffect } from "react";
import { X, Heart, ShoppingCart, Trash2, Loader } from "lucide-react";
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const WishlistPanel = ({ isOpen, onClose }) => {
  const { wishlist, loading, removeFromWishlist, fetchWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchWishlist();
    }
  }, [isOpen, isAuthenticated]);

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (item) => {
    try {
      setIsProcessing(true);
      await addToCart(item._id || item.id, 1);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddAllToCart = async () => {
    if (!wishlist || wishlist.length === 0) return;
    
    try {
      setIsProcessing(true);
      for (const item of wishlist) {
        await addToCart(item._id, 1);
      }
      toast.success('All items added to cart');
    } catch (error) {
      toast.error('Failed to add some items to cart');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        {isOpen && (
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          />
        )}

        <div
          className={`
            fixed top-0 right-0 h-screen w-full sm:w-96
            bg-white shadow-2xl
            z-50 transition-transform duration-300 ease-in-out
            flex flex-col
            ${isOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Heart size={24} className="text-red-500" fill="currentColor" />
              <h2 className="text-xl font-bold text-[#425A8B]">My Wishlist</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close wishlist"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <Heart size={64} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Please Sign In</h3>
            <p className="text-gray-600 mb-6">Sign in to view your wishlist and save items</p>
            <div className="space-y-3 w-full max-w-xs">
              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/login';
                }}
                className="w-full py-3 bg-[#425A8B] text-white font-medium rounded-lg hover:bg-[#334a7a] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 border border-[#425A8B] text-[#425A8B] font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        />
      )}

      {/* Wishlist Panel */}
      <div
        className={`
          fixed top-0 right-0 h-screen w-full sm:w-96
          bg-white shadow-2xl
          z-50 transition-transform duration-300 ease-in-out
          flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Heart size={24} className="text-red-500" fill="currentColor" />
            <h2 className="text-xl font-bold text-[#425A8B]">My Wishlist</h2>
            <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
              {wishlist?.length || 0}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close wishlist"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="animate-spin h-8 w-8 text-[#425A8B]" />
            </div>
          ) : !wishlist || wishlist.length === 0 ? (
            <div className="text-center py-12">
              <Heart size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6">Save items you love to buy later</p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#425A8B] text-white rounded-lg hover:bg-[#334a7a] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlist.map((item) => (
                <div key={item._id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.images?.[0]?.url || 'https://via.placeholder.com/100x100?text=No+Image'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 line-clamp-2 mb-2">{item.name}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-[#425A8B]">${item.price?.toFixed(2) || '0.00'}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-sm line-through text-gray-400">
                          ${item.originalPrice?.toFixed(2) || '0.00'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={isProcessing || item.stock === 0}
                        className="flex-1 py-2 px-3 bg-[#425A8B] text-white text-sm font-medium rounded hover:bg-[#334a7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={16} />
                        {isProcessing ? 'Adding...' : 'Add to Cart'}
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlist && wishlist.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <button
              onClick={handleAddAllToCart}
              disabled={isProcessing || loading}
              className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3"
            >
              {isProcessing ? 'Adding All...' : 'Add All to Cart'}
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 border border-[#425A8B] text-[#425A8B] font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistPanel;