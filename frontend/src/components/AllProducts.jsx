import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './Modal';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Search, Loader, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AllProducts = () => {
  // State Management
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
  const [isFetching, setIsFetching] = useState(false);

  // Refs for tracking
  const isInitialMount = useRef(true);
  const prevTabRef = useRef('all');
  const prevSortByRef = useRef('sales');
  const filterTimeoutRef = useRef(null);

  // Context Hooks
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
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

  // Configuration
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

  // Initial data fetch
  useEffect(() => {
    const initFetch = async () => {
      try {
        setIsFetching(true);
        console.log('🚀 Initial fetch started');
        await fetchProducts({ page: 1, limit, sortBy });
        
        // Fetch other data in parallel
        await Promise.all([
          fetchFeaturedProducts(),
          fetchBestSellers(),
          fetchNewArrivals()
        ]);
        console.log('✅ Initial fetch completed');
      } catch (err) {
        console.error('❌ Initial fetch error:', err);
        toast.error('Failed to load products');
      } finally {
        setIsFetching(false);
        isInitialMount.current = false;
      }
    };

    if (isInitialMount.current) {
      initFetch();
    }
  }, []);

  // Fetch data when tab or sort changes
  const fetchTabData = useCallback(async () => {
    const tabChanged = prevTabRef.current !== activeTab;
    const sortChanged = prevSortByRef.current !== sortBy;

    if (tabChanged || sortChanged || page !== 1) {
      try {
        setIsFetching(true);
        console.log(`🔄 Fetching data for tab: ${activeTab}, sort: ${sortBy}, page: ${page}`);
        
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
          default:
            await fetchProducts({ page, limit, sortBy });
        }

        // Update refs
        prevTabRef.current = activeTab;
        prevSortByRef.current = sortBy;
        console.log('✅ Tab data fetched successfully');
      } catch (err) {
        console.error('❌ Tab fetch error:', err);
        toast.error('Failed to load products');
      } finally {
        setIsFetching(false);
      }
    }
  }, [activeTab, page, limit, sortBy, searchTerm, categoryFilter, priceRange, 
      fetchProducts, fetchBestSellers, fetchNewArrivals, fetchFeaturedProducts]);

  // Effect for tab/sort/page changes
  useEffect(() => {
    if (!isInitialMount.current) {
      console.log('📡 Triggering tab data fetch');
      fetchTabData();
    }
  }, [activeTab, sortBy, page, fetchTabData]);

  // Debounced filter changes for "all" tab
  useEffect(() => {
    if (activeTab === 'all' && !isInitialMount.current) {
      // Clear previous timeout
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
      
      filterTimeoutRef.current = setTimeout(() => {
        console.log('🔍 Applying filters:', { searchTerm, categoryFilter, priceRange });
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

  // Get products to display based on active tab
  const getDisplayProducts = useCallback(() => {
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
        // Filter products with discount for best deals
        productsToShow = (products || []).filter(p => p.discount > 0);
        break;
      case 'all':
      default:
        productsToShow = products || [];
        break;
    }
    
    console.log(`📊 Displaying ${productsToShow.length} products for tab: ${activeTab}`);
    return productsToShow;
  }, [activeTab, bestSellers, newArrivals, featuredProducts, products]);

  const displayProducts = getDisplayProducts();

  // Event Handlers
  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      console.log('🛒 Adding to cart:', product.name);
      await addToCart(product._id, 0);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('❌ Cart error:', error);
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const handleBuyNow = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      return;
    }

    try {
      console.log('⚡ Buy now:', product.name);
      await addToCart(product._id, 1);
      setTimeout(() => {
        window.location.href = '/checkout';
      }, 500);
    } catch (error) {
      console.error('❌ Buy now error:', error);
      toast.error(error.message || 'Failed to process order');
    }
  };

  const handleViewDetails = (product) => {
    console.log('👀 Viewing details:', product.name);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleToggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to save items to wishlist');
      return;
    }

    try {
      console.log('💖 Toggling wishlist for product:', productId);
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(productId);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('❌ Wishlist error:', error);
      toast.error(error.message || 'Failed to update wishlist');
    }
  };

  const handleTabChange = (tabId) => {
    console.log(`📌 Changing tab to: ${tabId}`);
    setActiveTab(tabId);
    setPage(1);
    
    // Set appropriate sort for each tab
    if (tabId === 'best-deals') setSortBy('discount');
    else if (tabId === 'top-selling') setSortBy('sales');
    else setSortBy('sales');
  };

  const clearAllFilters = () => {
    console.log('🗑️ Clearing all filters');
    setSearchTerm('');
    setCategoryFilter('');
    setPriceRange({ min: '', max: '' });
    setSortBy('sales');
    setPage(1);
    setShowFilters(false);
  };

  // Pagination handlers - FIXED
  const handlePreviousPage = () => {
    if (page > 1) {
      console.log(`⬅️ Going to page: ${page - 1}`);
      setPage(prev => Math.max(1, prev - 1));
    }
  };

  const handleNextPage = () => {
    console.log(`➡️ Going to page: ${page + 1}`);
    setPage(prev => prev + 1);
  };

  const handlePageClick = (pageNum) => {
    console.log(`🔢 Going to page: ${pageNum}`);
    setPage(pageNum);
  };

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(products.length / limit));
  const hasProducts = displayProducts.length > 0;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if less than maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page, last page, and pages around current page
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(totalPages, page + 2);
      
      if (page <= 3) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (page >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  // Cleanup on unmount
  useEffect(() => {
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
            Discover our curated collection of premium products
          </p>
          
          {/* Stats Overview */}
          <div className="mt-6 inline-flex flex-wrap gap-4 bg-gray-50 px-6 py-3 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#425a8b]">{products.length}</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#425a8b]">{bestSellers.length}</div>
              <div className="text-sm text-gray-600">Best Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#425a8b]">{newArrivals.length}</div>
              <div className="text-sm text-gray-600">New Arrivals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#425a8b]">{featuredProducts.length}</div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products, categories, brands..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425a8b] focus:border-transparent shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-[#425a8b] text-white rounded-lg hover:bg-[#334a7a] transition-colors flex items-center justify-center gap-2"
            >
              <Filter size={20} />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425a8b] focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort by: {option.label}
                </option>
              ))}
            </select>
            
            {(searchTerm || categoryFilter || priceRange.min || priceRange.max) && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <X size={20} />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425a8b] focus:border-transparent"
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
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        placeholder="Min Price"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425a8b] focus:border-transparent"
                      />
                    </div>
                    <span className="self-center text-gray-500">to</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        placeholder="Max Price"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425a8b] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Items Per Page */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Items Per Page
                  </label>
                  <select
                    value={limit}
                    onChange={(e) => {
                      const newLimit = Number(e.target.value);
                      setLimit(newLimit);
                      setPage(1); // Reset to first page when changing limit
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425a8b] focus:border-transparent"
                  >
                    <option value={4}>4 items</option>
                    <option value={8}>8 items</option>
                    <option value={12}>12 items</option>
                    <option value={16}>16 items</option>
                    <option value={20}>20 items</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              let count = 0;
              
              switch (tab.id) {
                case 'all': count = products.length; break;
                case 'featured': count = featuredProducts.length; break;
                case 'top-selling': count = bestSellers.length; break;
                case 'new-arrivals': count = newArrivals.length; break;
                case 'best-deals': 
                  count = products.filter(p => p.discount && p.discount > 0).length; 
                  break;
              }
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-5 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#425a8b] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="font-medium">{tab.label}</span>
                  {count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      isActive ? 'bg-white/30' : 'bg-gray-300'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Results Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="text-gray-700">
              {isFetching || loading.products ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin h-4 w-4" />
                  <span>Loading products...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-semibold text-[#425a8b]">{displayProducts.length}</span>
                  <span>products found</span>
                  {searchTerm && (
                    <span className="text-gray-600">
                      for "<span className="font-medium">{searchTerm}</span>"
                    </span>
                  )}
                  {categoryFilter && categories.find(c => c._id === categoryFilter) && (
                    <span className="text-gray-600 ml-2">
                      in <span className="font-medium">
                        {categories.find(c => c._id === categoryFilter).name}
                      </span>
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {error && (
              <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        </div>

        {/* Products Content */}
        {isFetching && displayProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <Loader className="animate-spin h-16 w-16 text-[#425a8b] mb-4" />
            </div>
            <p className="text-lg text-gray-700 mb-2">Loading Products</p>
            <p className="text-sm text-gray-400">Fetching the best products for you...</p>
          </div>
        ) : !hasProducts ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-6">
                <Search size={80} className="mx-auto opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-8">
                {searchTerm 
                  ? `We couldn't find any products matching "${searchTerm}"`
                  : 'No products available in this category at the moment'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-[#425a8b] text-white font-medium rounded-lg hover:bg-[#334a7a] transition-colors"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => fetchTabData()}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Refresh Products
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {displayProducts.map((product) => (
                <ProductCard
                  key={product._id}
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

            {/* Pagination - Only for "all" tab */}
            {activeTab === 'all' && hasProducts && totalPages > 1 && (
              <>
                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-3">
                    {/* Previous Button */}
                    <button
                      onClick={handlePreviousPage}
                      disabled={page === 1 || isFetching}
                      className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${
                        page === 1 || isFetching
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronLeft size={20} />
                      <span>Previous</span>
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageClick(pageNum)}
                          disabled={isFetching}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                            page === pageNum
                              ? 'bg-[#425a8b] text-white shadow-md'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          } ${isFetching ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {pageNum}
                        </button>
                      ))}
                      
                      {/* Ellipsis for many pages */}
                      {totalPages > 5 && page < totalPages - 2 && (
                        <>
                          <span className="px-2 text-gray-400">...</span>
                          <button
                            onClick={() => handlePageClick(totalPages)}
                            disabled={isFetching}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              page === totalPages
                                ? 'bg-[#425a8b] text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            } ${isFetching ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    {/* Next Button */}
                    <button
                      onClick={handleNextPage}
                      disabled={page >= totalPages || isFetching}
                      className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${
                        page >= totalPages || isFetching
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>Next</span>
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Pagination Info */}
                <div className="text-center mt-4 text-gray-600 text-sm">
                  Showing page {page} of {totalPages} • 
                  Displaying {Math.min(limit, displayProducts.length)} of {products.length} products
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}
    </section>
  );
};

export default AllProducts;