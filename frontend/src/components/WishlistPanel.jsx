import React, { useState, useEffect, useCallback } from "react";
import { X, Heart, ShoppingCart, Trash2, Loader, AlertCircle } from "lucide-react";
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

const WishlistPanel = ({ isOpen, onClose }) => {
  const { wishlist, loading, removeFromWishlist, fetchWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [addingItemId, setAddingItemId] = useState(null);

  // Fetch wishlist when panel opens
  useEffect(() => {
    let isMounted = true;
    
    const loadWishlist = async () => {
      if (isOpen && isAuthenticated && isMounted) {
        try {
          await fetchWishlist();
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
          if (isMounted) {
            toast.error('Failed to load wishlist');
          }
        }
      }
    };

    loadWishlist();

    return () => {
      isMounted = false;
    };
  }, [isOpen, isAuthenticated]); // Removed fetchWishlist from dependencies to avoid re-renders

  const handleRemoveItem = async (productId, productName) => {
    try {
      await removeFromWishlist(productId);
      toast.success(`Removed "${productName}" from wishlist`);
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      toast.error(error.message || 'Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (item) => {
    if (!item._id) {
      toast.error('Invalid product');
      return;
    }

    if (item.stock === 0) {
      toast.error(`${item.name} is out of stock`);
      return;
    }

    try {
      setAddingItemId(item._id);
      setIsProcessing(true);
      
      await addToCart(item._id, 1);
      toast.success(`Added "${item.name}" to cart`);
      
      // Optional: Remove from wishlist after adding to cart
      // await removeFromWishlist(item._id);
      // toast.success(`Moved "${item.name}" to cart`);
      
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error.message || `Failed to add "${item.name}" to cart`);
    } finally {
      setAddingItemId(null);
      setIsProcessing(false);
    }
  };

  const handleAddAllToCart = async () => {
    if (!wishlist || wishlist.length === 0) return;
    
    const inStockItems = wishlist.filter(item => item.stock > 0);
    
    if (inStockItems.length === 0) {
      toast.error('All items in your wishlist are out of stock');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Use Promise.all for parallel processing instead of sequential
      const results = await Promise.allSettled(
        inStockItems.map(item => addToCart(item._id, 1))
      );
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      if (successful > 0) {
        toast.success(`Added ${successful} item${successful > 1 ? 's' : ''} to cart`);
      }
      
      if (failed > 0) {
        toast.error(`Failed to add ${failed} item${failed > 1 ? 's' : ''} to cart`);
      }
      
      // Refresh wishlist to update UI
      if (successful > 0) {
        await fetchWishlist();
      }
      
    } catch (error) {
      console.error('Add all to cart error:', error);
      toast.error('Failed to add items to cart');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderAuthRequiredView = () => (
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

  const renderWishlistContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="animate-spin h-8 w-8 text-[#425A8B] mb-4" />
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      );
    }

    if (!wishlist || wishlist.length === 0) {
      return (
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
      );
    }

    const inStockItems = wishlist.filter(item => item.stock > 0);
    const outOfStockItems = wishlist.filter(item => item.stock === 0);

    return (
      <>
        <div className="space-y-4">
          {inStockItems.map((item) => (
            <div key={item._id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="relative">
                <img
                  src={item.images?.[0]?.url || 'https://via.placeholder.com/100x100?text=No+Image'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                  }}
                />
                {item.discount > 0 && (
                  <span className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded">
                    -{item.discount}%
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 line-clamp-2 mb-2" title={item.name}>
                  {item.name}
                </h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-[#425A8B]">
                    ${item.price?.toFixed(2) || '0.00'}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-sm line-through text-gray-400">
                      ${item.originalPrice?.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={isProcessing || item.stock === 0}
                    className="flex-1 py-2 px-3 bg-[#425A8B] text-white text-sm font-medium rounded hover:bg-[#334a7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 min-w-0"
                  >
                    {addingItemId === item._id ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item._id, item.name)}
                    disabled={isProcessing}
                    className="p-2 text-red-500 hover:bg-red-50 rounded disabled:opacity-50 transition-colors"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {outOfStockItems.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-500" />
              Out of Stock ({outOfStockItems.length})
            </h4>
            <div className="space-y-3">
              {outOfStockItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.images?.[0]?.url || 'https://via.placeholder.com/50x50?text=No+Image'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-sm text-red-500">Out of Stock</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id, item.name)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  if (!isAuthenticated) {
    return renderAuthRequiredView();
  }

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
            <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full min-w-8 text-center">
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

        <div className="flex-1 overflow-y-auto p-6">
          {renderWishlistContent()}
        </div>

        {wishlist && wishlist.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Items in wishlist: <span className="font-semibold">{wishlist.length}</span>
              </p>
              <p className="text-sm text-gray-600">
                In stock: <span className="font-semibold text-green-600">
                  {wishlist.filter(item => item.stock > 0).length}
                </span>
              </p>
            </div>
            
            <button
              onClick={handleAddAllToCart}
              disabled={isProcessing || loading || wishlist.filter(item => item.stock > 0).length === 0}
              className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Adding All...
                </>
              ) : (
                'Add All to Cart'
              )}
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

WishlistPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default WishlistPanel;