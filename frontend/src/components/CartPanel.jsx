import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CartPanel = ({ isOpen, onClose }) => {
  const { cart, loading, updateCartItem, removeFromCart, clearCart, fetchCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchCart();
    }
  }, [isOpen, isAuthenticated]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await handleRemoveItem(productId);
      return;
    }

    try {
      await updateCartItem(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (error) {
        toast.error('Failed to clear cart');
      }
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      onClose();
      window.location.href = '/login?redirect=/checkout';
      return;
    }

    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    window.location.href = '/checkout';
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
          className={`fixed top-0 right-0 h-screen w-full sm:w-96 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out flex flex-col ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <ShoppingCart size={24} className="text-[#425A8B]" />
              <h2 className="text-xl font-bold text-[#425A8B]">Shopping Cart</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingCart size={64} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Please Sign In</h3>
            <p className="text-gray-600 mb-6">Sign in to view your cart and start shopping</p>
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
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-96 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingCart size={24} className="text-[#425A8B]" />
            <h2 className="text-xl font-bold text-[#425A8B]">Shopping Cart</h2>
            <span className="bg-[#425A8B] text-white text-sm px-2 py-1 rounded-full">
              {cart.itemCount || 0}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="animate-spin h-8 w-8 text-[#425A8B]" />
            </div>
          ) : cart.items.length === 0 ? (
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
              {cart.items.map((item) => (
                <div key={item._id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.image || item.product?.images?.[0]?.url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                    <p className="text-lg font-bold text-[#425A8B]">${item.price?.toFixed(2)}</p>
                    
                    {/* Stock Status */}
                    <div className="text-sm text-gray-500 mb-2">
                      {item.stock > 0 ? (
                        <span className="text-green-600">In Stock</span>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right text-sm font-medium text-gray-700 mt-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            {/* Cart Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${cart.total?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Items</span>
                <span className="font-medium">{cart.itemCount || 0}</span>
              </div>
              <div className="text-sm text-gray-500">
                Shipping and taxes calculated at checkout
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                disabled={isProcessing || loading}
                className="w-full py-3 bg-[#425A8B] text-white font-medium rounded-lg hover:bg-[#334a7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={handleClearCart}
                  className="flex-1 py-2 border border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-50 transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2 border border-[#425A8B] text-[#425A8B] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPanel;