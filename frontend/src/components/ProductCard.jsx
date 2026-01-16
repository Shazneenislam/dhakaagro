import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Eye, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ 
  product, 
  onAddToCart,
  onBuyNow,
  onViewDetails,
  onToggleWishlist,
  isWishlisted,
  showTimer = true,
  showCategory = true,
  showWishlist = true,
  showViewButton = true
}) => {
  const [localIsWishlisted, setLocalIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    console.log('💖 [ProductCard] Wishlist status:', { 
      productId: product?._id, 
      isWishlisted 
    });
    setLocalIsWishlisted(isWishlisted);
  }, [product?._id, isWishlisted]);

  if (!product) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  const {
    _id,
    name,
    category,
    images,
    price,
    originalPrice,
    discount,
    rating,
    stock,
    timer,
    sales,
    views
  } = product;

  const handleAddToCartClick = async () => {
    console.log('🛒 [ProductCard] Add to cart clicked:', name);
    setIsAddingToCart(true);
    try {
      await addToCart(_id, 1);
      if (onAddToCart) onAddToCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlistClick = async () => {
    console.log('💖 [ProductCard] Toggle wishlist:', name);
    try {
      if (localIsWishlisted) {
        await removeFromWishlist(_id);
      } else {
        await addToWishlist(_id);
      }
      setLocalIsWishlisted(!localIsWishlisted);
      if (onToggleWishlist) onToggleWishlist();
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { days, hours, minutes, secs };
  };

  const timerData = formatTime(timer || 0);

  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        </div>
      )}

      {/* Wishlist Button */}
      {showWishlist && (
        <button
          onClick={handleToggleWishlistClick}
          className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${localIsWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      )}

      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-gray-50">
        <img
          src={images?.[0]?.url || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            console.log('🖼️ [ProductCard] Image failed to load:', images?.[0]?.url);
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
        
        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={handleAddToCartClick}
            disabled={isAddingToCart || stock === 0}
            className="p-2 bg-white rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add to Cart"
          >
            <ShoppingCart className="h-5 w-5 text-gray-700" />
          </button>
          {showViewButton && (
            <button
              onClick={() => {
                console.log('👀 [ProductCard] View details:', name);
                if (onViewDetails) onViewDetails();
              }}
              className="p-2 bg-white rounded-full hover:bg-gray-100"
              title="View Details"
            >
              <Eye className="h-5 w-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {showCategory && category?.name && (
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {category.name}
          </p>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-12">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-[#425a8b]">
            ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
          </span>
          {originalPrice > price && (
            <span className="text-sm text-gray-400 line-through">
              ${typeof originalPrice === 'number' ? originalPrice.toFixed(2) : '0.00'}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500">
            ({product.numReviews || 0})
          </span>
        </div>

        {/* Timer */}
        {showTimer && timer > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Sale ends in:</span>
            </div>
            <div className="flex gap-1 mt-1">
              {[
                { value: timerData.days, label: 'D' },
                { value: timerData.hours, label: 'H' },
                { value: timerData.minutes, label: 'M' },
                { value: timerData.secs, label: 'S' },
              ].map((item, index) => (
                <div key={index} className="flex-1 text-center">
                  <div className="bg-gray-100 rounded py-1">
                    <span className="font-bold text-gray-800">
                      {item.value.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stock Status */}
        <div className="mb-4">
          {stock === 0 ? (
            <span className="text-red-500 text-sm font-medium">Out of Stock</span>
          ) : stock < 10 ? (
            <span className="text-orange-500 text-sm font-medium">
              Only {stock} left in stock
            </span>
          ) : (
            <span className="text-green-500 text-sm font-medium">In Stock</span>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
          <span>Sold: {sales || 0}</span>
          <span>Views: {views || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;