import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './Modal';

const BestSellers = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('sales');
  
  const sampleProducts = [
    {
      id: 1,
      name: 'HALAL TURKEY (AROUND 12-13 LB)',
      category: 'Meat',
      subcategory: 'Poultry',
      image: 'https://images.unsplash.com/photo-1587590227264-0ac64ce63ce8?w=600&h=600&fit=crop',
      price: 28.07,
      originalPrice: 35.60,
      discount: 21,
      rating: 4.5,
      reviewCount: 65,
      sales: 450,
      views: 1200,
      timer: 86400,
      stock: 25,
      isWishlisted: false,
      brand: 'Premium Halal',
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
      category: 'Grocery',
      subcategory: 'Cooking Oil',
      image: 'https://images.unsplash.com/photo-1533050487297-09b450131914?w=600&h=600&fit=crop',
      price: 13.99,
      originalPrice: 25.60,
      discount: 45,
      rating: 4.2,
      reviewCount: 89,
      sales: 320,
      views: 950,
      timer: 43200,
      stock: 42,
      isWishlisted: false,
      brand: 'Olio Villa',
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
      category: 'Vegetables',
      subcategory: 'Fresh Produce',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=600&fit=crop',
      price: 10.99,
      originalPrice: 35.60,
      discount: 69,
      rating: 4.8,
      reviewCount: 120,
      sales: 890,
      views: 2500,
      timer: 7200,
      stock: 150,
      isWishlisted: false,
      brand: 'Organic Farm',
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
      category: 'Meat',
      subcategory: 'Poultry',
      image: 'https://images.unsplash.com/photo-1589987607627-8cfae2d0ebd4?w=600&h=600&fit=crop',
      price: 8.99,
      originalPrice: 12.99,
      discount: 31,
      rating: 4.3,
      reviewCount: 75,
      sales: 670,
      views: 1800,
      timer: 3600,
      stock: 18,
      isWishlisted: false,
      brand: 'Farm Fresh',
      description: 'Boneless, skinless chicken breast. Perfect for grilling, baking, or stir-frying. High in protein and low in fat.',
      specifications: [
        { label: 'Weight', value: '500g' },
        { label: 'Type', value: 'Boneless, Skinless' },
        { label: 'Storage', value: 'Keep refrigerated' },
        { label: 'Best Before', value: '3 days' },
        { label: 'Origin', value: 'Free-range farm' }
      ]
    },
    {
      id: 5,
      name: 'Premium Basmati Rice 5kg',
      category: 'Grocery',
      subcategory: 'Rice & Grains',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
      price: 15.99,
      originalPrice: 19.99,
      discount: 20,
      rating: 4.6,
      reviewCount: 210,
      sales: 1200,
      views: 3500,
      timer: 172800,
      stock: 65,
      isWishlisted: false,
      brand: 'Royal Harvest',
      description: 'Long grain basmati rice with aromatic fragrance. Perfect for biryanis, pilafs, and everyday meals.',
      specifications: [
        { label: 'Weight', value: '5kg' },
        { label: 'Type', value: 'Basmati Rice' },
        { label: 'Grain', value: 'Long Grain' },
        { label: 'Origin', value: 'India' }
      ]
    },
    {
      id: 6,
      name: 'Fresh Milk 1L',
      category: 'Dairy',
      subcategory: 'Milk & Cream',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=600&fit=crop',
      price: 2.99,
      originalPrice: 3.49,
      discount: 14,
      rating: 4.4,
      reviewCount: 150,
      sales: 2300,
      views: 4200,
      timer: 28800,
      stock: 100,
      isWishlisted: false,
      brand: 'Pure Dairy',
      description: 'Fresh pasteurized milk, rich in calcium and vitamins. Perfect for drinking, cooking, and baking.',
      specifications: [
        { label: 'Volume', value: '1 Liter' },
        { label: 'Type', value: 'Full Cream' },
        { label: 'Storage', value: 'Keep refrigerated' },
        { label: 'Best Before', value: '7 days' }
      ]
    },
    {
      id: 7,
      name: 'Organic Apples 1kg',
      category: 'Fruits',
      subcategory: 'Fresh Produce',
      image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&h=600&fit=crop',
      price: 4.99,
      originalPrice: 6.99,
      discount: 29,
      rating: 4.7,
      reviewCount: 95,
      sales: 780,
      views: 2100,
      timer: 14400,
      stock: 85,
      isWishlisted: false,
      brand: 'Organic Farm',
      description: 'Fresh organic apples, crisp and juicy. Rich in fiber and antioxidants.',
      specifications: [
        { label: 'Weight', value: '1kg' },
        { label: 'Type', value: 'Organic' },
        { label: 'Variety', value: 'Gala Apples' },
        { label: 'Origin', value: 'Local Orchard' }
      ]
    },
    {
      id: 8,
      name: 'Frozen Shrimp 500g',
      category: 'Seafood',
      subcategory: 'Frozen Food',
      image: 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=600&h=600&fit=crop',
      price: 12.99,
      originalPrice: 16.99,
      discount: 24,
      rating: 4.5,
      reviewCount: 85,
      sales: 420,
      views: 1300,
      timer: 57600,
      stock: 32,
      isWishlisted: false,
      brand: 'Ocean Fresh',
      description: 'Premium frozen shrimp, ready to cook. Perfect for stir-fries, curries, and grilling.',
      specifications: [
        { label: 'Weight', value: '500g' },
        { label: 'Type', value: 'Peeled & Deveined' },
        { label: 'Size', value: 'Medium (31-40 count)' },
        { label: 'Storage', value: 'Keep frozen' }
      ]
    }
  ];

  const sortOptions = [
    { value: 'sales', label: 'Top Selling' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'discount', label: 'Best Deals' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'New Arrivals' }
  ];

  const tabs = [
    { id: 'all', label: 'All Products' },
    { id: 'top-selling', label: 'Top Selling' },
    { id: 'top-brands', label: 'Top Brands' },
    { id: 'most-viewed', label: 'Most Viewed' },
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'best-deals', label: 'Best Deals' }
  ];

  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
    alert(`Added ${product.name} to cart!`);
  };

  const handleBuyNow = (product) => {
    console.log('Buy now:', product);
    alert(`Proceeding to buy ${product.name}!`);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleToggleWishlist = (productId, isWishlisted) => {
    console.log(`Product ${productId} wishlisted: ${isWishlisted}`);
  };

  // Filter and sort products based on active tab and sort option
  const getFilteredProducts = () => {
    let filtered = [...sampleProducts];

    // Filter by active tab
    switch (activeTab) {
      case 'top-selling':
        filtered = filtered.sort((a, b) => b.sales - a.sales);
        break;
      case 'top-brands':
        filtered = filtered.filter(p => p.brand === 'Premium Halal' || p.brand === 'Royal Harvest' || p.rating >= 4.5);
        break;
      case 'most-viewed':
        filtered = filtered.sort((a, b) => b.views - a.views);
        break;
      case 'new-arrivals':
        filtered = filtered.slice(0, 6); // Show newest products
        break;
      case 'best-deals':
        filtered = filtered.sort((a, b) => b.discount - a.discount);
        break;
      default:
        // 'all' - show all products
        break;
    }

    // Additional sorting based on sortBy selection
    switch (sortBy) {
      case 'sales':
        filtered.sort((a, b) => b.sales - a.sales);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    // Limit to 8 products for best sellers section
    return filtered.slice(0, 8);
  };

  const filteredProducts = getFilteredProducts();

  return (
    <section className="bg-white py-10 md:py-15 lg:py-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#425a8b] leading-tight">
            ALL Products
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#425a8b]/60 leading-tight mt-3">
            Discover our most popular products this month
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-[#425a8b]/10 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-[#425a8b]">8+</div>
            <div className="text-gray-600">Featured Products</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-[#425a8b]/10 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-[#425a8b]">4.5★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-[#425a8b]/10 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-[#425a8b]">500+</div>
            <div className="text-gray-600">Daily Sales</div>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-[#425a8b]/10 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-[#425a8b]">20-69%</div>
            <div className="text-gray-600">Discount Range</div>
          </div>
        </div>

        {/* Filter and Sort Bar */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    // Auto-set sort by based on tab selection
                    if (tab.id === 'top-selling') setSortBy('sales');
                    else if (tab.id === 'best-deals') setSortBy('discount');
                    else if (tab.id === 'most-viewed') setSortBy('sales');
                  }}
                  className={`px-4 py-2 text-sm md:text-base font-medium rounded-full transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-white bg-gradient-to-r from-[#425a8b] to-[#334a7a] shadow-lg'
                      : 'text-[#425a8b] hover:text-black hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-gray-600 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425a8b] focus:border-transparent bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center text-gray-600 mb-4">
            <div>
              Showing <span className="font-bold text-[#425a8b]">{filteredProducts.length}</span> best selling products
            </div>
            <div className="text-sm">
              <span className="text-green-600 font-medium">In Stock:</span> All items available
            </div>
          </div>
        </div>

        <div className="my-8">
          <hr className="border-b border-gray-200" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
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

        {/* Featured Brands */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#425a8b] mb-6 text-center">Featured Brands</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {['Premium Halal', 'Olio Villa', 'Organic Farm', 'Royal Harvest', 'Pure Dairy', 'Ocean Fresh'].map((brand) => (
              <div
                key={brand}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="text-center">
                  <div className="text-lg font-semibold text-[#425a8b]">{brand}</div>
                  <div className="text-sm text-gray-500">Premium Quality</div>
                </div>
              </div>
            ))}
          </div>
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