import React from "react";
import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";

const CartPanel = ({ isOpen, onClose, cartItems = [] }) => {
  const handleRemoveItem = (itemId) => {
    // Remove item logic
    console.log("Remove item:", itemId);
  };

  const handleUpdateQuantity = (itemId, change) => {
    // Update quantity logic
    console.log("Update quantity:", itemId, change);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const sampleItems = [
    { id: 1, name: "HALAL TURKEY", price: 28.07, quantity: 1, image: "https://images.unsplash.com/photo-1587590227264-0ac64ce63ce8?w=100&h=100&fit=crop" },
    { id: 2, name: "OLIO VILLA OIL", price: 13.99, quantity: 2, image: "https://images.unsplash.com/photo-1533050487297-09b450131914?w=100&h=100&fit=crop" },
    { id: 3, name: "Big Potatoes", price: 10.99, quantity: 1, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100&h=100&fit=crop" },
  ];

  const itemsToShow = cartItems.length > 0 ? cartItems : sampleItems;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        />
      )}

      {/* Cart Panel */}
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
            <ShoppingCart size={24} className="text-[#425A8B]" />
            <h2 className="text-xl font-bold text-[#425A8B]">Shopping Cart</h2>
            <span className="bg-[#425A8B] text-white text-sm px-2 py-1 rounded-full">
              {itemsToShow.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {itemsToShow.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some items to get started</p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#425A8B] text-white rounded-lg hover:bg-[#334a7a] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {itemsToShow.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                    <p className="text-lg font-bold text-[#425A8B]">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded"
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
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-2xl font-bold text-[#425A8B]">${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-500 mb-6">
              Shipping and taxes calculated at checkout
            </div>
            <div className="space-y-3">
              <button className="w-full py-3 bg-[#425A8B] text-white font-medium rounded-lg hover:bg-[#334a7a] transition-colors">
                Checkout Now
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 border border-[#425A8B] text-[#425A8B] font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPanel;