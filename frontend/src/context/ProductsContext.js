// contexts/productsContext.js
import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
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

  // Track render count to detect infinite loops
  const renderCount = useRef(0);
  const isInitialMount = useRef(true);

  // Debug: Track state changes
  useEffect(() => {
    renderCount.current += 1;
    console.log(`🔄 [ProductsContext] Render #${renderCount.current}`, {
      productsCount: products.length,
      featuredProductsCount: featuredProducts.length,
      bestSellersCount: bestSellers.length,
      newArrivalsCount: newArrivals.length,
      categoriesCount: categories.length,
      loading,
      error
    });
    
    // Warn if too many renders
    if (renderCount.current > 20) {
      console.warn('⚠️ [ProductsContext] Excessive re-renders detected!');
    }
  });

  // Set loading state for specific type
  const setLoadingState = useCallback((type, isLoading) => {
    console.log(`⏳ [ProductsContext] Loading state: ${type} = ${isLoading}`);
    setLoading(prev => ({ ...prev, [type]: isLoading }));
  }, []);

  // ✅ FIXED: fetchProducts with proper dependency handling
  const fetchProducts = useCallback(async (params = {}) => {
    setLoadingState('products', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching products with params:', params);
      
      const response = await productAPI.getProducts({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        sortBy: params.sortBy || 'createdAt',
        ...params
      });
      
      console.log('✅ [ProductsContext] API Response received:', {
        hasResponse: !!response,
        responseType: typeof response,
        isArray: Array.isArray(response)
      });
      
      let productsList = [];
      let newPagination = { ...pagination };
      
      // Handle different response formats
      if (response) {
        if (response.products && Array.isArray(response.products)) {
          productsList = response.products;
          console.log(`📦 Got ${productsList.length} products from response.products`);
        } else if (Array.isArray(response)) {
          productsList = response;
          console.log(`📦 Got ${productsList.length} products directly from response`);
        } else if (response.data && Array.isArray(response.data)) {
          productsList = response.data;
          console.log(`📦 Got ${productsList.length} products from response.data`);
        } else {
          console.warn('⚠️ Unexpected response format:', response);
          productsList = [];
        }
        
        // Update pagination if available
        if (response.total !== undefined) {
          newPagination = {
            page: response.currentPage || (params.page || pagination.page),
            limit: response.limit || (params.limit || pagination.limit),
            total: response.total,
            totalPages: response.totalPages || Math.ceil(response.total / (params.limit || pagination.limit))
          };
        }
      }
      
      // Only update state if data actually changed to prevent unnecessary re-renders
      setProducts(prev => {
        if (JSON.stringify(prev) === JSON.stringify(productsList)) {
          return prev;
        }
        return productsList;
      });
      
      setPagination(prev => {
        if (JSON.stringify(prev) === JSON.stringify(newPagination)) {
          return prev;
        }
        return newPagination;
      });
      
      return { products: productsList, pagination: newPagination };
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch products';
      console.error('❌ [ProductsContext] Error fetching products:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        fullError: err
      });
      
      setError(errorMessage);
      setProducts([]);
      
      const userMessage = err.response?.data?.message || errorMessage;
      toast.error(`Failed to load products: ${userMessage}`);
      
      throw err;
    } finally {
      setLoadingState('products', false);
    }
  }, [setLoadingState, pagination]); // Only depend on setLoadingState and pagination

  // ✅ FIXED: fetchProduct
  const fetchProduct = useCallback(async (id) => {
    if (!id) {
      toast.error('Product ID is required');
      throw new Error('Product ID is required');
    }
    
    setLoadingState('singleProduct', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching product by ID:', id);
      const product = await productAPI.getProduct(id);
      console.log('✅ [ProductsContext] Product fetched:', { id, name: product.name });
      return product;
    } catch (err) {
      const errorMessage = err.message || `Failed to fetch product (ID: ${id})`;
      console.error('Error fetching product:', err);
      setError(errorMessage);
      toast.error(`Failed to load product: ${err.response?.data?.message || errorMessage}`);
      throw err;
    } finally {
      setLoadingState('singleProduct', false);
    }
  }, [setLoadingState]);

  // ✅ FIXED: fetchProductBySlug
  const fetchProductBySlug = useCallback(async (slug) => {
    if (!slug) {
      toast.error('Product slug is required');
      throw new Error('Product slug is required');
    }
    
    setLoadingState('singleProduct', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching product by slug:', slug);
      const product = await productAPI.getProductBySlug(slug);
      console.log('✅ [ProductsContext] Product by slug fetched:', { slug, name: product.name });
      return product;
    } catch (err) {
      const errorMessage = err.message || `Failed to fetch product (slug: ${slug})`;
      console.error('Error fetching product by slug:', err);
      setError(errorMessage);
      toast.error(`Failed to load product: ${err.response?.data?.message || errorMessage}`);
      throw err;
    } finally {
      setLoadingState('singleProduct', false);
    }
  }, [setLoadingState]);

  // ✅ FIXED: fetchFeaturedProducts
  const fetchFeaturedProducts = useCallback(async () => {
    setLoadingState('featured', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching featured products');
      const featured = await productAPI.getFeaturedProducts();
      
      let featuredList = [];
      if (featured) {
        if (Array.isArray(featured)) {
          featuredList = featured;
        } else if (featured.products && Array.isArray(featured.products)) {
          featuredList = featured.products;
        } else if (featured.data && Array.isArray(featured.data)) {
          featuredList = featured.data;
        }
      }
      
      console.log('✅ [ProductsContext] Featured products:', featuredList.length);
      
      // Only update if changed
      setFeaturedProducts(prev => {
        if (JSON.stringify(prev) === JSON.stringify(featuredList)) {
          return prev;
        }
        return featuredList;
      });
      
      return featuredList;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch featured products';
      console.error('❌ [ProductsContext] Error fetching featured products:', err);
      setError(errorMessage);
      setFeaturedProducts([]);
      toast.error('Failed to load featured products');
      return [];
    } finally {
      setLoadingState('featured', false);
    }
  }, [setLoadingState]);

  // ✅ FIXED: fetchBestSellers
  const fetchBestSellers = useCallback(async () => {
    setLoadingState('featured', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching best sellers');
      const best = await productAPI.getBestSellers();
      
      let bestSellersList = [];
      if (best) {
        if (Array.isArray(best)) {
          bestSellersList = best;
        } else if (best.products && Array.isArray(best.products)) {
          bestSellersList = best.products;
        } else if (best.data && Array.isArray(best.data)) {
          bestSellersList = best.data;
        }
      }
      
      console.log('✅ [ProductsContext] Best sellers:', bestSellersList.length);
      
      setBestSellers(prev => {
        if (JSON.stringify(prev) === JSON.stringify(bestSellersList)) {
          return prev;
        }
        return bestSellersList;
      });
      
      return bestSellersList;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch best sellers';
      console.error('❌ [ProductsContext] Error fetching best sellers:', err);
      setError(errorMessage);
      setBestSellers([]);
      toast.error('Failed to load best sellers');
      return [];
    } finally {
      setLoadingState('featured', false);
    }
  }, [setLoadingState]);

  // ✅ FIXED: fetchNewArrivals
  const fetchNewArrivals = useCallback(async () => {
    setLoadingState('featured', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching new arrivals');
      const newArr = await productAPI.getNewArrivals();
      
      let newArrivalsList = [];
      if (newArr) {
        if (Array.isArray(newArr)) {
          newArrivalsList = newArr;
        } else if (newArr.products && Array.isArray(newArr.products)) {
          newArrivalsList = newArr.products;
        } else if (newArr.data && Array.isArray(newArr.data)) {
          newArrivalsList = newArr.data;
        }
      }
      
      console.log('✅ [ProductsContext] New arrivals:', newArrivalsList.length);
      
      setNewArrivals(prev => {
        if (JSON.stringify(prev) === JSON.stringify(newArrivalsList)) {
          return prev;
        }
        return newArrivalsList;
      });
      
      return newArrivalsList;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch new arrivals';
      console.error('❌ [ProductsContext] Error fetching new arrivals:', err);
      setError(errorMessage);
      setNewArrivals([]);
      toast.error('Failed to load new arrivals');
      return [];
    } finally {
      setLoadingState('featured', false);
    }
  }, [setLoadingState]);

  // ✅ FIXED: fetchRelatedProducts
  const fetchRelatedProducts = useCallback(async (productId) => {
    if (!productId) return [];
    
    setLoadingState('products', true);
    
    try {
      console.log('📡 [ProductsContext] Fetching related products for:', productId);
      const related = await productAPI.getRelatedProducts(productId);
      
      let relatedList = [];
      if (related) {
        if (Array.isArray(related)) {
          relatedList = related;
        } else if (related.products) {
          relatedList = related.products;
        } else if (related.data) {
          relatedList = related.data;
        }
      }
      
      console.log('✅ [ProductsContext] Related products:', relatedList.length);
      return relatedList;
    } catch (err) {
      console.warn('❌ [ProductsContext] Error fetching related products:', err.message);
      return [];
    } finally {
      setLoadingState('products', false);
    }
  }, [setLoadingState]);

  // ✅ FIXED: createReview
  const createReview = useCallback(async (productId, reviewData) => {
    if (!productId || !reviewData) {
      toast.error('Product ID and review data are required');
      throw new Error('Missing required parameters');
    }
    
    try {
      console.log('📝 [ProductsContext] Creating review for product:', productId);
      const result = await productAPI.createReview(productId, reviewData);
      toast.success('Review submitted successfully');
      
      // Refresh the product to get updated reviews
      await fetchProduct(productId);
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to submit review';
      console.error('❌ [ProductsContext] Error creating review:', err);
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchProduct]);

  // ✅ FIXED: fetchCategories
  const fetchCategories = useCallback(async () => {
    setLoadingState('categories', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching categories');
      const cats = await categoryAPI.getCategories();
      
      let categoriesList = [];
      if (cats) {
        if (Array.isArray(cats)) {
          categoriesList = cats;
        } else if (cats.data && Array.isArray(cats.data)) {
          categoriesList = cats.data;
        }
      }
      
      console.log('✅ [ProductsContext] Categories:', categoriesList.length);
      
      setCategories(prev => {
        if (JSON.stringify(prev) === JSON.stringify(categoriesList)) {
          return prev;
        }
        return categoriesList;
      });
      
      return categoriesList;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch categories';
      console.error('❌ [ProductsContext] Error fetching categories:', err);
      setError(errorMessage);
      setCategories([]);
      toast.error('Failed to load categories');
      return [];
    } finally {
      setLoadingState('categories', false);
    }
  }, [setLoadingState]);

  // ✅ FIXED: fetchFeaturedCategories
  const fetchFeaturedCategories = useCallback(async () => {
    setLoadingState('categories', true);
    
    try {
      console.log('📡 [ProductsContext] Fetching featured categories');
      const featuredCats = await categoryAPI.getFeaturedCategories();
      
      let featuredCatsList = [];
      if (featuredCats) {
        if (Array.isArray(featuredCats)) {
          featuredCatsList = featuredCats;
        } else if (featuredCats.data && Array.isArray(featuredCats.data)) {
          featuredCatsList = featuredCats.data;
        }
      }
      
      console.log('✅ [ProductsContext] Featured categories:', featuredCatsList.length);
      
      setFeaturedCategories(prev => {
        if (JSON.stringify(prev) === JSON.stringify(featuredCatsList)) {
          return prev;
        }
        return featuredCatsList;
      });
      
      return featuredCatsList;
    } catch (err) {
      console.warn('❌ [ProductsContext] Error fetching featured categories:', err.message);
      setFeaturedCategories([]);
      return [];
    } finally {
      setLoadingState('categories', false);
    }
  }, [setLoadingState]);

  // ✅ FIXED: searchProducts
  const searchProducts = useCallback(async (query, params = {}) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return [];
    }
    
    setLoadingState('search', true);
    setError(null);
    
    try {
      console.log('🔍 [ProductsContext] Searching products:', { query, params });
      const response = await productAPI.getProducts({
        search: query,
        ...params
      });
      
      let results = [];
      if (response) {
        if (response.products && Array.isArray(response.products)) {
          results = response.products;
        } else if (Array.isArray(response)) {
          results = response;
        } else if (response.data && Array.isArray(response.data)) {
          results = response.data;
        }
      }
      
      console.log('✅ [ProductsContext] Search results:', results.length);
      
      setSearchResults(prev => {
        if (JSON.stringify(prev) === JSON.stringify(results)) {
          return prev;
        }
        return results;
      });
      
      return results;
    } catch (err) {
      const errorMessage = err.message || 'Search failed';
      console.error('❌ [ProductsContext] Error searching products:', err);
      setError(errorMessage);
      setSearchResults([]);
      toast.error('Search failed');
      return [];
    } finally {
      setLoadingState('search', false);
    }
  }, [setLoadingState]);

  // ✅ FIXED: getProductsByCategory
  const getProductsByCategory = useCallback(async (categoryId, params = {}) => {
    if (!categoryId) {
      toast.error('Category ID is required');
      return [];
    }
    
    setLoadingState('products', true);
    setError(null);
    
    try {
      console.log('📡 [ProductsContext] Fetching products by category:', categoryId);
      const response = await productAPI.getProducts({
        category: categoryId,
        ...params
      });
      
      let categoryProducts = [];
      if (response) {
        if (response.products && Array.isArray(response.products)) {
          categoryProducts = response.products;
        } else if (Array.isArray(response)) {
          categoryProducts = response;
        } else if (response.data && Array.isArray(response.data)) {
          categoryProducts = response.data;
        }
      }
      
      console.log('✅ [ProductsContext] Category products:', categoryProducts.length);
      return categoryProducts;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch category products';
      console.error('❌ [ProductsContext] Error fetching category products:', err);
      setError(errorMessage);
      toast.error('Failed to load category products');
      return [];
    } finally {
      setLoadingState('products', false);
    }
  }, [setLoadingState]);

  // ✅ FIXED: getProductsByCategorySlug
  const getProductsByCategorySlug = useCallback(async (slug, params = {}) => {
    if (!slug) {
      toast.error('Category slug is required');
      throw new Error('Category slug is required');
    }
    
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
      
      let categoryProducts = [];
      if (response) {
        if (response.products && Array.isArray(response.products)) {
          categoryProducts = response.products;
        } else if (Array.isArray(response)) {
          categoryProducts = response;
        } else if (response.data && Array.isArray(response.data)) {
          categoryProducts = response.data;
        }
      }
      
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
  }, [setLoadingState]);

  // ✅ FIXED: updatePagination
  const updatePagination = useCallback((updates) => {
    console.log('📄 [ProductsContext] Updating pagination:', updates);
    setPagination(prev => {
      const newPagination = { ...prev, ...updates };
      if (JSON.stringify(prev) === JSON.stringify(newPagination)) {
        return prev;
      }
      return newPagination;
    });
  }, []);

  // ✅ FIXED: clearSearchResults
  const clearSearchResults = useCallback(() => {
    console.log('🧹 [ProductsContext] Clearing search results');
    setSearchResults([]);
    setError(null);
  }, []);

  // ✅ FIXED: clearError
  const clearError = useCallback(() => {
    console.log('🧹 [ProductsContext] Clearing error');
    setError(null);
  }, []);

  // ✅ FIXED: refreshAllData - with debounce to prevent multiple calls
  const refreshAllData = useCallback(async () => {
    console.log('🔄 [ProductsContext] Refreshing all data');
    try {
      // Use Promise.all to fetch all data in parallel
      await Promise.all([
        fetchProducts({ page: 1, limit: 10 }),
        fetchFeaturedProducts(),
        fetchBestSellers(),
        fetchNewArrivals(),
        fetchCategories(),
        fetchFeaturedCategories()
      ]);
      toast.success('Data refreshed successfully');
    } catch (err) {
      console.error('❌ [ProductsContext] Error refreshing data:', err);
      toast.error('Failed to refresh data');
    }
  }, [fetchProducts, fetchFeaturedProducts, fetchBestSellers, fetchNewArrivals, fetchCategories, fetchFeaturedCategories]);

  // ✅ FIXED: Initial data fetch - ONLY ON MOUNT
  useEffect(() => {
    if (isInitialMount.current) {
      console.log('🚀 [ProductsContext] Initial mount - fetching initial data');
      
      const initializeData = async () => {
        try {
          // Fetch initial data in parallel
          await Promise.all([
            fetchProducts({ page: 1, limit: 8, sortBy: 'sales' }),
            fetchCategories()
          ]);
          
          // Fetch additional data sequentially to avoid overwhelming the API
          await fetchFeaturedProducts();
          await fetchBestSellers();
          await fetchNewArrivals();
          await fetchFeaturedCategories();
          
          console.log('✅ [ProductsContext] Initial data fetch complete');
        } catch (err) {
          console.error('❌ [ProductsContext] Failed to initialize data:', err);
          toast.error('Failed to load initial data');
        }
      };
      
      initializeData();
      isInitialMount.current = false;
    }
  }, []); // Empty dependency array - ONLY run once on mount

  // Helper functions (client-side filtering if needed)
  const getProductById = useCallback((id) => {
    return products.find(p => p._id === id);
  }, [products]);

  const getProductsByCategoryId = useCallback((categoryId) => {
    return products.filter(p => p.category?._id === categoryId);
  }, [products]);

  const getProductsByCategorySlugClient = useCallback((slug) => {
    return products.filter(p => p.category?.slug === slug);
  }, [products]);

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
    
    // Helper functions
    getProductById,
    getProductsByCategoryId,
    getProductsByCategorySlugClient,
    
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