import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './Modal';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Search, Loader, Filter, X } from 'lucide-react';

const AllProducts = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('sales');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [showFilters, setShowFilters] = useState(false);

  // Use refs to track initial mount
  const isInitialMount = useRef(true);
  const prevTabRef = useRef('all');
  const prevSortByRef = useRef('sales');

  const { cart, addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const {
    products,
    featuredProducts,
    bestSellers,
    newArrivals,
    loading,
    error,
    fetchProducts,
    fetchFeaturedProducts,
    fetchBestSellers,
    fetchNewArrivals,
    categories
  } = useProducts();

  // Debug: Log state changes - FIXED: Remove product[0] reference that could cause re-renders
  useEffect(() => {
    console.log('🔍 [AllProducts] Products updated:', {
      count: products.length,
      loading: loading.products,
      error
    });
  }, [products.length, loading.products, error]);

  // Initial fetch - FIXED: Only run once on mount
  useEffect(() => {
    console.log('🚀 [AllProducts] Initial mount - fetching products');
    
    const initFetch = async () => {
      try {
        await fetchProducts({ page: 1, limit, sortBy });
        // Also fetch other data
        await Promise.all([
          fetchFeaturedProducts(),
          fetchBestSellers(),
          fetchNewArrivals()
        ]);
      } catch (err) {
        console.error('❌ [AllProducts] Initial fetch error:', err);
      }
    };
    
    if (isInitialMount.current) {
      initFetch();
      isInitialMount.current = false;
    }
  }, []); // Empty dependency array - run only once

  // Fetch products when tab or sort changes - FIXED: Prevent infinite loops
  const fetchTabData = useCallback(async () => {
    console.log('🔄 [AllProducts] Fetching for tab:', activeTab);
    
    try {
      switch (activeTab) {
        case 'all':
          await fetchProducts({ 
            page, 
            limit, 
            sortBy, 
            search: searchTerm, 
            category: categoryFilter,
            minPrice: priceRange.min,
            maxPrice: priceRange.max
          });
          break;
        case 'top-selling':
          await fetchBestSellers();
          break;
        case 'new-arrivals':
          await fetchNewArrivals();
          break;
        case 'featured':
          await fetchFeaturedProducts();
          break;
        case 'best-deals':
          await fetchProducts({ 
            sortBy: 'discount',
            page,
            limit 
          });
          break;
      }
    } catch (err) {
      console.error('❌ [AllProducts] Tab fetch error:', err);
    }
  }, [activeTab, page, limit, sortBy, searchTerm, categoryFilter, priceRange, 
      fetchProducts, fetchBestSellers, fetchNewArrivals, fetchFeaturedProducts]);

  // FIXED: Only fetch when tab or sortBy actually changes
  useEffect(() => {
    if (isInitialMount.current) return; // Skip on initial mount
    
    // Check if tab or sortBy actually changed
    const tabChanged = prevTabRef.current !== activeTab;
    const sortChanged = prevSortByRef.current !== sortBy;
    
    if (tabChanged || sortChanged || page !== 1) {
      console.log('📡 [AllProducts] Tab/sort/page changed, fetching data');
      fetchTabData();
      
      // Update refs
      prevTabRef.current = activeTab;
      prevSortByRef.current = sortBy;
    }
  }, [activeTab, sortBy, page, fetchTabData]);

  // Debounced filter changes - FIXED: Use ref to track timeout
  const filterTimeoutRef = useRef(null);
  useEffect(() => {
    if (activeTab === 'all' && !isInitialMount.current) {
      // Clear previous timeout
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
      
      filterTimeoutRef.current = setTimeout(() => {
        console.log('🔍 [AllProducts] Applying filters:', { searchTerm, categoryFilter, priceRange });
        fetchProducts({ 
          page: 1,
          limit, 
          sortBy, 
          search: searchTerm, 
          category: categoryFilter,
          minPrice: priceRange.min,
          maxPrice: priceRange.max
        });
        setPage(1);
      }, 500);

      return () => {
        if (filterTimeoutRef.current) {
          clearTimeout(filterTimeoutRef.current);
        }
      };
    }
  }, [searchTerm, categoryFilter, priceRange, activeTab, limit, sortBy, fetchProducts]);

  // Get products to display - FIXED: Memoize properly
  const displayProducts = useCallback(() => {
    let productsToShow = [];
    
    switch (activeTab) {
      case 'top-selling':
        productsToShow = bestSellers || [];
        break;
      case 'new-arrivals':
        productsToShow = newArrivals || [];
        break;
      case 'featured':
        productsToShow = featuredProducts || [];
        break;
      case 'best-deals':
      case 'all':
      default:
        productsToShow = products || [];
        break;
    }
    
    return productsToShow;
  }, [activeTab, bestSellers, newArrivals, featuredProducts, products]);

  const currentDisplayProducts = displayProducts();

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleBuyNow = async (product) => {
    try {
      await addToCart(product._id, 1);
      window.location.href = '/checkout';
    } catch (error) {
      console.error('Error buying now:', error);
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleToggleWishlist = async (productId) => {
    try {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Products' },
    { id: 'top-selling', label: 'Top Selling' },
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'featured', label: 'Featured' },
    { id: 'best-deals', label: 'Best Deals' },
  ];

  const sortOptions = [
    { value: 'sales', label: 'Top Selling' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'discount', label: 'Best Deals' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'New Arrivals' },
  ];

  const clearAllFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setPriceRange({ min: '', max: '' });
    setSortBy('sales');
    setPage(1);
  };

  // FIXED: Also check the ProductsContext for potential infinite loops
  useEffect(() => {
    // Cleanup function
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="bg-white py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#425a8b] leading-tight">
            ALL Products
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 mt-2">
            Discover our most popular products
          </p>
          
          {/* Debug Stats */}
          <div className="mt-4 inline-flex gap-4 bg-gray-50 px-4 py-2 rounded-lg">
            <div className="text-sm">
              <span className="font-semibold text-[#425a8b]">Products:</span>
              <span className="ml-2">{products.length}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-[#425a8b]">Featured:</span>
              <span className="ml-2">{featuredProducts.length}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-[#425a8b]">Best Sellers:</span>
              <span className="ml-2">{bestSellers.length}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-[#425a8b]">New Arrivals:</span>
              <span className="ml-2">{newArrivals.length}</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by name, category, or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425a8b] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
            <button
              onClick={clearAllFilters}
              className="px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
            >
              <X size={20} />
              <span>Clear All</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425a8b]"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      placeholder="Min"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425a8b]"
                    />
                    <span className="self-center">-</span>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      placeholder="Max"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425a8b]"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425a8b]"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(1);
                  if (tab.id === 'best-deals') setSortBy('discount');
                  else if (tab.id === 'top-selling') setSortBy('sales');
                  else setSortBy('sales');
                }}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#425a8b] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
                {tab.id === 'all' && products.length > 0 && (
                  <span className="ml-2 bg-white/30 px-2 py-0.5 rounded-full text-xs">
                    {products.length}
                  </span>
                )}
                {tab.id === 'featured' && featuredProducts.length > 0 && (
                  <span className="ml-2 bg-white/30 px-2 py-0.5 rounded-full text-xs">
                    {featuredProducts.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Results Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="text-gray-600">
              {loading.products ? (
                <span>Loading products...</span>
              ) : (
                <>
                  Showing <span className="font-bold text-[#425a8b]">{currentDisplayProducts.length}</span> products
                  {searchTerm && (
                    <span className="ml-2 text-sm">
                      for "<span className="font-medium">{searchTerm}</span>"
                    </span>
                  )}
                </>
              )}
            </div>
            
            {error && (
              <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading.products && currentDisplayProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="animate-spin h-12 w-12 text-[#425a8b] mb-4" />
            <p className="text-gray-600">Loading products...</p>
            <p className="text-sm text-gray-400 mt-2">Fetching from API...</p>
          </div>
        ) : currentDisplayProducts.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Search size={64} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No products match "${searchTerm}"`
                  : 'No products available at the moment'}
              </p>
              <div className="space-y-3">
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-[#425a8b] text-white rounded-lg hover:bg-[#334a7a]"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => fetchTabData()}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Retry Loading
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {currentDisplayProducts.map((product, index) => (
                <ProductCard
                  key={product._id || `product-${index}`}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  onBuyNow={() => handleBuyNow(product)}
                  onViewDetails={() => handleViewDetails(product)}
                  onToggleWishlist={() => handleToggleWishlist(product._id)}
                  isWishlisted={isInWishlist(product._id)}
                  showTimer={true}
                  showCategory={true}
                  showWishlist={true}
                  showViewButton={true}
                />
              ))}
            </div>

            {/* Pagination for "All Products" tab */}
            {activeTab === 'all' && products.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1 || loading.products}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>←</span>
                    <span>Previous</span>
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, Math.ceil(products.length / limit)))].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          page === i + 1
                            ? 'bg-[#425a8b] text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={products.length < page * limit || loading.products}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>Next</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
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

export default AllProducts;