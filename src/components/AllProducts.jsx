import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './Modal';

const BestSellers = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const sampleProducts = [
    {
      id: 1,
      name: 'HALAL TURKEY (AROUND 12-13 LB)',
      category: 'Turkey',
      image: 'https://images.unsplash.com/photo-1587590227264-0ac64ce63ce8?w=600&h=600&fit=crop',
      price: 28.07,
      originalPrice: 35.60,
      discount: 21,
      rating: 4.5,
      reviewCount: 65,
      timer: 86400,
      isWishlisted: false,
      description: 'Premium halal turkey, carefully sourced and processed following strict halal guidelines. Perfect for family gatherings, special occasions, and festive meals.',
      specifications: [
        { label: 'Weight', value: '12-13 LB' },
        { label: 'Type', value: 'Halal Certified' },
        { label: 'Storage', value: 'Keep frozen at -18°C' },
        { label: 'Shelf Life', value: '12 months frozen' },
        { label: 'Origin', value: 'Locally sourced' }
      ]
    },
    {
      id: 2,
      name: 'OLIO VILLA BLENDED PROMACE OIL 3.785L',
      category: 'Oil/Ghee/Dalda',
      image: 'https://images.unsplash.com/photo-1533050487297-09b450131914?w=600&h=600&fit=crop',
      price: 13.99,
      originalPrice: 25.60,
      discount: 45,
      rating: 4.2,
      reviewCount: 89,
      timer: 43200,
      isWishlisted: false,
      description: 'Premium blended promace oil suitable for all types of cooking including frying, sautéing, and baking. Low cholesterol and rich in nutrients.',
      specifications: [
        { label: 'Volume', value: '3.785L (1 Gallon)' },
        { label: 'Type', value: 'Blended Cooking Oil' },
        { label: 'Shelf Life', value: '24 months' },
        { label: 'Smoke Point', value: '220°C' },
        { label: 'Best For', value: 'Frying & Cooking' }
      ]
    },
    {
      id: 3,
      name: 'Big Potatoes 1 Kg',
      category: 'Vegetable',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=600&fit=crop',
      price: 10.99,
      originalPrice: 35.60,
      discount: 69,
      rating: 4.8,
      reviewCount: 120,
      timer: 7200,
      isWishlisted: false,
      description: 'Fresh, organic potatoes perfect for boiling, baking, frying, and mashing. Rich in vitamins and minerals, sourced directly from local farms.',
      specifications: [
        { label: 'Weight', value: '1 Kg' },
        { label: 'Type', value: 'Organic' },
        { label: 'Variety', value: 'Russet Potatoes' },
        { label: 'Storage', value: 'Cool dry place' },
        { label: 'Origin', value: 'Local Farm' }
      ]
    },
    {
      id: 4,
      name: 'Fresh Chicken Breast 500g',
      category: 'Poultry',
      image: 'https://images.unsplash.com/photo-1589987607627-8cfae2d0ebd4?w=600&h=600&fit=crop',
      price: 8.99,
      originalPrice: 12.99,
      discount: 31,
      rating: 4.3,
      reviewCount: 75,
      timer: 3600,
      isWishlisted: false,
      description: 'Boneless, skinless chicken breast. Perfect for grilling, baking, or stir-frying. High in protein and low in fat.',
      specifications: [
        { label: 'Weight', value: '500g' },
        { label: 'Type', value: 'Boneless, Skinless' },
        { label: 'Storage', value: 'Keep refrigerated' },
        { label: 'Best Before', value: '3 days' },
        { label: 'Origin', value: 'Free-range farm' }
      ]
    }
  ];

  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
    // Add cart logic here
    alert(`Added ${product.name} to cart!`);
  };

  const handleBuyNow = (product) => {
    console.log('Buy now:', product);
    // Add buy now logic here
    alert(`Proceeding to buy ${product.name}!`);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleToggleWishlist = (productId, isWishlisted) => {
    console.log(`Product ${productId} wishlisted: ${isWishlisted}`);
    // Update wishlist logic
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'best-seller', label: 'Best Seller' },
    { id: 'most-viewed', label: 'Most Viewed' },
    { id: 'top-brands', label: 'Top Brands' }
  ];

  const filteredProducts = activeTab === 'all' 
    ? sampleProducts 
    : sampleProducts.filter(p => p.category.toLowerCase().includes(activeTab));

  return (
    <section className="bg-white py-10 md:py-15 lg:py-20">
      {/* Title and Tabs Section */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12">
          <div className="text-center lg:text-left mb-8 lg:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#425a8b] leading-tight">
              Best Sellers
            </h1>
            <p className="text-sm md:text-lg lg:text-2xl font-normal text-[#425a8b]/60 leading-tight pt-3">
              Special products in this month
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm md:text-base font-medium rounded-full transition-colors ${
                  activeTab === tab.id
                    ? 'text-white bg-[#425a8b]'
                    : 'text-[#425a8b] hover:text-black hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="my-8">
          <hr className="border-b border-gray-200" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onViewDetails={handleViewDetails}
              onToggleWishlist={handleToggleWishlist}
              showTimer={true}
              showCategory={true}
              showWishlist={true}
              showViewButton={true}
            />
          ))}
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </section>
  );
};

export default BestSellers;