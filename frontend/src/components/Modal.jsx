import React from 'react';

const ProductModal = ({ product, isOpen, onClose, onAddToCart, onBuyNow }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        {/* Modal Content */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              {/* Product Image */}
              <div className="sm:w-1/2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-contain sm:h-96"
                />
              </div>

              {/* Product Details */}
              <div className="mt-4 sm:mt-0 sm:ml-6 sm:w-1/2">
                <h3 className="text-lg leading-6 font-bold text-[#425a8b] mb-2">
                  {product.name}
                </h3>
                
                {/* Category */}
                <div className="text-sm text-gray-500 mb-4">{product.category}</div>
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm ml-2">({product.reviewCount} reviews)</span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-[#425a8b]">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg line-through text-[#8c9fc6] ml-3">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    {product.discount > 0 && (
                      <span className="ml-3 px-2 py-1 text-sm font-bold text-white bg-red-500 rounded">
                        Save {product.discount}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600">{product.description || "No description available."}</p>
                </div>

                {/* Specifications */}
                {product.specifications && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Specifications</h4>
                    <ul className="text-gray-600">
                      {product.specifications.map((spec, index) => (
                        <li key={index} className="mb-1">
                          <span className="font-medium">{spec.label}:</span> {spec.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    className="flex-1 py-3 text-sm font-bold text-[#425a8b] rounded-full border border-[#425a8b] hover:bg-gray-50 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      onBuyNow(product);
                      onClose();
                    }}
                    className="flex-1 py-3 text-sm font-bold text-white bg-[#425a8b] rounded-full border border-[#425a8b] hover:bg-[#334a7a] transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Close Button */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;