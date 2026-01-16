import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { productAPI, categoryAPI } from '../services/api';
import toast from 'react-hot-toast';

const ProductsContext = createContext(null);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState({
    products: false,
    categories: false,
    featured: false,
    search: false,
    singleProduct: false
  });
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Debug: Track state changes
  useEffect(() => {
    console.log('🔄 [ProductsContext] Context initialized with state:', {
      productsCount: products.length,
      featuredProductsCount: featuredProducts.length,
      bestSellersCount: bestSellers.length,
      newArrivalsCount: newArrivals.length,
      loading,
      error
    });
  }, []);

  useEffect(() => {
    console.log('📊 [ProductsContext] State updated:', {
      productsCount: products.length,
      loading,
      error
    });
  }, [products, loading, error]);

  // Set loading state for specific type
  const setLoadingState = useCallback((type, isLoading) => {
    console.log(`⏳ [ProductsContext] Loading state changed: ${type} = ${isLoading}`);
    setLoading(prev => ({ ...prev, [type]: isLoading }));
  }, []);

  // Fetch all products with filters
  const fetchProducts = useCallback(async (params = {}) => {
    setLoadingState('products', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching products with params:', {
        ...params,
        page: pagination.page,
        limit: pagination.limit
      });
      
      const response = await productAPI.getProducts({
        page: pagination.page,
        limit: pagination.limit,
        ...params
      });
      
      console.log('✅ [ProductsContext] API Response:', {
        hasResponse: !!response,
        responseType: typeof response,
        isArray: Array.isArray(response),
        responseKeys: response ? Object.keys(response) : 'no response',
        productsCount: response?.products?.length || (Array.isArray(response) ? response.length : 0),
        response
      });
      
      // Handle different response formats
      let productsList = [];
      if (response) {
        if (response.products && Array.isArray(response.products)) {
          productsList = response.products;
          console.log('📦 Got products array from response.products');
        } else if (Array.isArray(response)) {
          productsList = response;
          console.log('📦 Got products array directly from response');
        } else {
          console.log('⚠️ Unexpected response format:', response);
          productsList = [];
        }
      }
      
      setProducts(productsList);
      
      // Update pagination if response includes pagination data
      if (response && response.total !== undefined) {
        setPagination(prev => ({
          ...prev,
          page: response.currentPage || prev.page,
          total: response.total,
          totalPages: response.totalPages || Math.ceil(response.total / prev.limit)
        }));
      }
      
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch products';
      console.error('❌ [ProductsContext] Error fetching products:', {
        message: err.message,
        stack: err.stack,
        fullError: err
      });
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoadingState('products', false);
    }
  }, [setLoadingState, pagination.page, pagination.limit]);

  // Fetch single product by ID
  const fetchProduct = useCallback(async (id) => {
    setLoadingState('singleProduct', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching product by ID:', id);
      const product = await productAPI.getProduct(id);
      console.log('✅ [ProductsContext] Product response:', product);
      return product;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch product details';
      console.error('❌ [ProductsContext] Error fetching product:', err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoadingState('singleProduct', false);
    }
  }, [setLoadingState]);

  // Fetch product by slug
  const fetchProductBySlug = useCallback(async (slug) => {
    setLoadingState('singleProduct', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching product by slug:', slug);
      const product = await productAPI.getProductBySlug(slug);
      console.log('✅ [ProductsContext] Product by slug response:', product);
      return product;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch product';
      console.error('❌ [ProductsContext] Error fetching product by slug:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoadingState('singleProduct', false);
    }
  }, [setLoadingState]);

  // Fetch featured products
  const fetchFeaturedProducts = useCallback(async () => {
    setLoadingState('featured', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching featured products');
      const featured = await productAPI.getFeaturedProducts();
      console.log('✅ [ProductsContext] Featured products response:', {
        hasData: !!featured,
        isArray: Array.isArray(featured),
        count: featured?.length || 0
      });
      setFeaturedProducts(featured || []);
      return featured || [];
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch featured products';
      console.error('❌ [ProductsContext] Error fetching featured products:', err);
      setError(errorMessage);
      setFeaturedProducts([]); // Clear any previous data
      throw err;
    } finally {
      setLoadingState('featured', false);
    }
  }, [setLoadingState]);

  // Fetch best sellers
  const fetchBestSellers = useCallback(async () => {
    setLoadingState('featured', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching best sellers');
      const best = await productAPI.getBestSellers();
      console.log('✅ [ProductsContext] Best sellers response:', {
        hasData: !!best,
        isArray: Array.isArray(best),
        count: best?.length || 0
      });
      setBestSellers(best || []);
      return best || [];
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch best sellers';
      console.error('❌ [ProductsContext] Error fetching best sellers:', err);
      setError(errorMessage);
      setBestSellers([]); // Clear any previous data
      throw err;
    } finally {
      setLoadingState('featured', false);
    }
  }, [setLoadingState]);

  // Fetch new arrivals
  const fetchNewArrivals = useCallback(async () => {
    setLoadingState('featured', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching new arrivals');
      const newArr = await productAPI.getNewArrivals();
      console.log('✅ [ProductsContext] New arrivals response:', {
        hasData: !!newArr,
        isArray: Array.isArray(newArr),
        count: newArr?.length || 0
      });
      setNewArrivals(newArr || []);
      return newArr || [];
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch new arrivals';
      console.error('❌ [ProductsContext] Error fetching new arrivals:', err);
      setError(errorMessage);
      setNewArrivals([]); // Clear any previous data
      throw err;
    } finally {
      setLoadingState('featured', false);
    }
  }, [setLoadingState]);

  // Fetch related products
  const fetchRelatedProducts = useCallback(async (productId) => {
    setLoadingState('products', true);
    
    try {
      console.log('📡 [ProductsContext] Fetching related products for:', productId);
      const related = await productAPI.getRelatedProducts(productId);
      console.log('✅ [ProductsContext] Related products response:', related?.length || 0);
      return related || [];
    } catch (err) {
      console.warn('❌ [ProductsContext] Error fetching related products:', err.message);
      return [];
    } finally {
      setLoadingState('products', false);
    }
  }, [setLoadingState]);

  // Create product review
  const createReview = useCallback(async (productId, reviewData) => {
    try {
      console.log('📝 [ProductsContext] Creating review for product:', productId);
      await productAPI.createReview(productId, reviewData);
      toast.success('Review submitted successfully');
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
      throw err;
    }
  }, []);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setLoadingState('categories', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching categories');
      const cats = await categoryAPI.getCategories();
      console.log('✅ [ProductsContext] Categories response:', {
        hasData: !!cats,
        isArray: Array.isArray(cats),
        count: cats?.length || 0
      });
      setCategories(cats || []);
      return cats || [];
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch categories';
      console.error('❌ [ProductsContext] Error fetching categories:', err);
      setError(errorMessage);
      setCategories([]); // Clear any previous data
      throw err;
    } finally {
      setLoadingState('categories', false);
    }
  }, [setLoadingState]);

  // Fetch featured categories
  const fetchFeaturedCategories = useCallback(async () => {
    setLoadingState('categories', true);
    
    try {
      console.log('📡 [ProductsContext] Fetching featured categories');
      const featuredCats = await categoryAPI.getFeaturedCategories();
      console.log('✅ [ProductsContext] Featured categories response:', {
        hasData: !!featuredCats,
        isArray: Array.isArray(featuredCats),
        count: featuredCats?.length || 0
      });
      setFeaturedCategories(featuredCats || []);
      return featuredCats || [];
    } catch (err) {
      console.warn('❌ [ProductsContext] Error fetching featured categories:', err.message);
      setFeaturedCategories([]); // Clear any previous data
      return [];
    } finally {
      setLoadingState('categories', false);
    }
  }, [setLoadingState]);

  // Search products
  const searchProducts = useCallback(async (query, params = {}) => {
    setLoadingState('search', true);
    setError(null);
    
    try {
      console.log('🔍 [ProductsContext] Searching products with query:', query);
      const response = await productAPI.getProducts({
        search: query,
        ...params
      });
      
      const results = response.products || response || [];
      console.log('✅ [ProductsContext] Search results:', results.length);
      setSearchResults(results);
      return results;
    } catch (err) {
      const errorMessage = err.message || 'Search failed';
      console.error('❌ [ProductsContext] Error searching products:', err);
      setError(errorMessage);
      setSearchResults([]); // Clear any previous results
      throw err;
    } finally {
      setLoadingState('search', false);
    }
  }, [setLoadingState]);

  // Get products by category
  const getProductsByCategory = useCallback(async (categoryId, params = {}) => {
    setLoadingState('products', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching products by category:', categoryId);
      const response = await productAPI.getProducts({
        category: categoryId,
        ...params
      });
      
      const categoryProducts = response.products || response || [];
      console.log('✅ [ProductsContext] Category products:', categoryProducts.length);
      return categoryProducts;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch category products';
      console.error('❌ [ProductsContext] Error fetching category products:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoadingState('products', false);
    }
  }, [setLoadingState]);

  // Get products by category slug
  const getProductsByCategorySlug = useCallback(async (slug, params = {}) => {
    setLoadingState('products', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching products by category slug:', slug);
      // First get category by slug
      const category = await categoryAPI.getCategoryBySlug(slug);
      
      if (!category) {
        throw new Error('Category not found');
      }
      
      // Then get products for this category
      const response = await productAPI.getProducts({
        category: category._id,
        ...params
      });
      
      const categoryProducts = response.products || response || [];
      console.log('✅ [ProductsContext] Category slug products:', {
        categoryName: category.name,
        productsCount: categoryProducts.length
      });
      return {
        category,
        products: categoryProducts
      };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch products for category';
      console.error('❌ [ProductsContext] Error fetching products by category slug:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoadingState('products', false);
    }
  }, []);

  // Update pagination
  const updatePagination = useCallback((updates) => {
    console.log('📄 [ProductsContext] Updating pagination:', updates);
    setPagination(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Clear search results
  const clearSearchResults = useCallback(() => {
    console.log('🧹 [ProductsContext] Clearing search results');
    setSearchResults([]);
    setError(null);
  }, []);

  // Clear all errors
  const clearError = useCallback(() => {
    console.log('🧹 [ProductsContext] Clearing error');
    setError(null);
  }, []);

  // Refresh all data
  const refreshAllData = useCallback(async () => {
    console.log('🔄 [ProductsContext] Refreshing all data');
    try {
      await Promise.all([
        fetchProducts(),
        fetchFeaturedProducts(),
        fetchBestSellers(),
        fetchNewArrivals(),
        fetchCategories(),
        fetchFeaturedCategories()
      ]);
      toast.success('Data refreshed successfully');
    } catch (err) {
      console.error('❌ [ProductsContext] Error refreshing data:', err);
    }
  }, [fetchProducts, fetchFeaturedProducts, fetchBestSellers, fetchNewArrivals, fetchCategories, fetchFeaturedCategories]);

  const value = {
    // State
    products,
    featuredProducts,
    bestSellers,
    newArrivals,
    categories,
    featuredCategories,
    loading,
    error,
    searchResults,
    pagination,
    
    // Actions
    fetchProducts,
    fetchProduct,
    fetchProductBySlug,
    fetchFeaturedProducts,
    fetchBestSellers,
    fetchNewArrivals,
    fetchRelatedProducts,
    createReview,
    fetchCategories,
    fetchFeaturedCategories,
    searchProducts,
    getProductsByCategory,
    getProductsByCategorySlug,
    
    // Pagination
    updatePagination,
    
    // Utility functions
    clearSearchResults,
    clearError,
    refreshAllData,
    
    // Helper functions (client-side filtering if needed)
    getProductById: (id) => products.find(p => p._id === id),
    getProductsByCategoryId: (categoryId) => products.filter(p => p.category?._id === categoryId),
    getProductsByCategorySlugClient: (slug) => products.filter(p => p.category?.slug === slug),
    
    // Loading states for specific operations
    isLoading: loading.products,
    isCategoriesLoading: loading.categories,
    isFeaturedLoading: loading.featured,
    isSearchLoading: loading.search,
    isSingleProductLoading: loading.singleProduct
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};