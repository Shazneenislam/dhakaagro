// components/ProductCard/ProductCard.jsx
import React, { useState } from 'react';
import viewIcon from './view.svg';
import cartIcon from './cart.svg';
import loveIcon from './love.svg';
import discountTag from './Group 2.png';

const ProductCard = ({ 
  product = {}, 
  onAddToCart = () => {}, 
  onBuyNow = () => {}, 
  onViewDetails = () => {},
  onToggleWishlist = () => {},
  showTimer = true,
  showCategory = true,
  showWishlist = true,
  showViewButton = true
}) => {
  // Set default product values to prevent undefined errors
  const defaultProduct = {
    id: '',
    name: 'Product Name',
    category: 'Category',
    image: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    rating: 0,
    reviewCount: 0,
    timer: 0,
    description: '',
    specifications: [],
    isWishlisted: false,
    ...product // Override defaults with actual product data
  };

  const [isWishlisted, setIsWishlisted] = useState(defaultProduct.isWishlisted);

  const handleWishlistToggle = () => {
    const newWishlistState = !isWishlisted;
    setIsWishlisted(newWishlistState);
    onToggleWishlist(defaultProduct.id, newWishlistState);
  };

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { days, hours, minutes, secs };
  };

  const timerData = formatTime(defaultProduct.timer || 0);

  // Early return if product has no data
  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="relative bg-white shadow-[0px_4px_100px_15px_#BFBFBF] rounded-3xl p-6 animate-pulse">
        <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative bg-white shadow-[0px_4px_100px_15px_#BFBFBF] hover:shadow-[0px_4px_100px_20px_#A9A9A9] rounded-2xl transition-all duration-300 max-w-xs w-full">
      {/* Discount Tag - POSITION FIXED */}
      {defaultProduct.discount > 0 && (
        <div className="absolute top-[-5px] left-[-5px] z-10 pr-3 overflow-hidden rounded-tl-lg">
          <div className="relative">
            <img 
              src={discountTag}  
              alt="Discount Tag" 
              className="w-16 h-16 rounded-tl-lg" 
              onError={(e) => e.target.src = 'https://via.placeholder.com/50x50?text=Tag'}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-[8px] font-bold text-white leading-none">SALE</div>
              <div className="text-xs font-black text-white leading-none">{defaultProduct.discount}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Product Image Section */}
      <div className="p-3 rounded-md">
        {/* Image Container */}
        <div className="flex relative h-40 rounded-md mb-4 overflow-hidden">
          {defaultProduct.image ? (
            <img
              src={defaultProduct.image}
              alt={defaultProduct.name}
              className="w-full h-full object-contain p-3 rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {/* Price Section - POSITION FIXED */}
          <div className="flex items-center justify-end mb-3">
            <div className="text-right">
              {/* Current Price - LARGE */}
              <div className="text-2xl font-bold text-[#425a8b]">
                ${defaultProduct.price.toFixed(2)}
              </div>
              
              {/* Original Price - Small and Strikethrough */}
              {defaultProduct.originalPrice > 0 && defaultProduct.originalPrice > defaultProduct.price && (
                <div className="text-sm text-gray-400 line-through">
                  ${defaultProduct.originalPrice.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>

        

        {/* Product Info */}
        <div className="mt-4">
          {/* Category */}
          {showCategory && defaultProduct.category && (
            <div className="text-sm text-gray-400 mb-1">{defaultProduct.category}</div>
          )}

          {/* Product Name */}
          <h3 className="text-lg font-bold text-[#425a8b] mb-2 line-clamp-2 min-h-[3.5rem]">
            {defaultProduct.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(defaultProduct.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-500 text-sm ml-2">({defaultProduct.reviewCount})</span>
          </div>

          {/* Timer (Optional) */}
          {showTimer && defaultProduct.timer > 0 && (
            <div className="mb-4">
              <div className="bg-[#425a8b] rounded-full px-4 py-2">
                <div className="flex justify-center items-center text-white text-xs font-medium">
                  <div className="text-center mx-1">
                    <span className="block">{timerData.days.toString().padStart(2, '0')}</span>
                    <span className="text-xs opacity-75">Day</span>
                  </div>
                  <span className="mx-1">:</span>
                  <div className="text-center mx-1">
                    <span className="block">{timerData.hours.toString().padStart(2, '0')}</span>
                    <span className="text-xs opacity-75">Hour</span>
                  </div>
                  <span className="mx-1">:</span>
                  <div className="text-center mx-1">
                    <span className="block">{timerData.minutes.toString().padStart(2, '0')}</span>
                    <span className="text-xs opacity-75">Min</span>
                  </div>
                  <span className="mx-1">:</span>
                  <div className="text-center mx-1">
                    <span className="block">{timerData.secs.toString().padStart(2, '0')}</span>
                    <span className="text-xs opacity-75">Sec</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {showViewButton && (
              <button
                onClick={() => onViewDetails(defaultProduct)}
                className="flex-1 py-2 text-sm font-bold text-[#425a8b] rounded-full border border-[#425a8b] hover:bg-gray-50 transition-colors flex items-center justify-center"
                title="View Details"
              >
                <img src={viewIcon} alt="View Details" className="w-5 h-5" />
              </button>
            )}
            
            <button
              onClick={() => onAddToCart(defaultProduct)}
              className="flex-1 py-2 text-sm font-bold text-[#425a8b] rounded-full border border-[#425a8b] hover:bg-gray-50 transition-colors flex items-center justify-center"
              title="Add to Cart"
            >
              <img src={cartIcon} alt="Add to Cart" className="w-5 h-5" />
            </button>
            
            {/* Wishlist Button */}
            {showWishlist && (
              <button
                onClick={handleWishlistToggle}
                className={`flex-1 py-2 text-sm font-bold rounded-full border transition-colors flex items-center justify-center ${
                  isWishlisted 
                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                    : 'bg-[#425a8b] text-white border-[#425a8b] hover:bg-[#334a7a]'
                }`}
              >
                {isWishlisted ? (
                  <img src={loveIcon} alt="Remove from Wishlist" className="w-5 h-5" />
                ) : (
                  <img src={loveIcon} alt="Add to Wishlist" className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;