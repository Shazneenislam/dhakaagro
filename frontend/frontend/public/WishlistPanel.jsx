import React from "react";
import { X, Heart, ShoppingCart, Trash2 } from "lucide-react";

const WishlistPanel = ({ isOpen, onClose, wishlistItems = [] }) => {
  const handleRemoveItem = (itemId) => {
    // Remove from wishlist logic
    console.log("Remove from wishlist:", itemId);
  };

  const handleAddToCart = (item) => {
    // Add to cart logic
    console.log("Add to cart:", item);
  };

  const sampleItems = [
    { id: 1, name: "HALAL TURKEY (AROUND 12-13 LB)", price: 28.07, originalPrice: 35.60, image: "https://images.unsplash.com/photo-1587590227264-0ac64ce63ce8?w=100&h=100&fit=crop" },
    { id: 2, name: "Fresh Chicken Breast 500g", price: 8.99, originalPrice: 12.99, image: "https://images.unsplash.com/photo-1589987607627-8cfae2d0ebd4?w=100&h=100&fit=crop" },
    { id: 3, name: "Organic Apples 1kg", price: 4.99, originalPrice: 6.99, image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=100&h=100&fit=crop" },
    { id: 4, name: "Premium Basmati Rice 5kg", price: 15.99, originalPrice: 19.99, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop" },
  ];

  const itemsToShow = wishlistItems.length > 0 ? wishlistItems : sampleItems;

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
              {itemsToShow.length}
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
          {itemsToShow.length === 0 ? (
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
              {itemsToShow.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 line-clamp-2 mb-2">{item.name}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-[#425A8B]">${item.price.toFixed(2)}</span>
                      {item.originalPrice && (
                        <span className="text-sm line-through text-gray-400">${item.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 py-2 px-3 bg-[#425A8B] text-white text-sm font-medium rounded hover:bg-[#334a7a] transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
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
        {itemsToShow.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <button
              onClick={() => {
                // Add all to cart logic
                console.log("Add all to cart");
              }}
              className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors mb-3"
            >
              Add All to Cart
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