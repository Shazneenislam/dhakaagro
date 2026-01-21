import axios from 'axios';

// Define API_CONFIG - ONLY ONCE
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://dhakaagro.onrender.com',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

console.log('🔧 [API] Initializing with config:', {
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  env: process.env.NODE_ENV,
  apiUrl: process.env.REACT_APP_API_URL
});

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 [API] Adding auth token to request');
    } else {
      console.log('🔓 [API] No auth token found, making unauthenticated request');
    }
    
    console.log('🚀 [API] Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullUrl: config.baseURL + config.url,
      hasData: !!config.data,
      timestamp: new Date().toISOString()
    });
    
    return config;
  },
  (error) => {
    console.error('❌ [API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ [API] Response received:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      dataType: typeof response.data,
      timestamp: new Date().toISOString()
    });
    
    return response.data;
  },
  (error) => {
    console.error('❌ [API] Response error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      fullError: error
    });
    
    const { response } = error;
    
    if (response?.status === 401) {
      console.warn('🔒 [API] Unauthorized access, clearing token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    // Return a consistent error format
    const errorData = {
      message: response?.data?.message || error.message || 'Unknown error',
      status: response?.status,
      data: response?.data,
      url: error.config?.url
    };
    
    return Promise.reject(errorData);
  }
);

// ============ AUTH API ============
export const authAPI = {
  register: (userData) => {
    console.log('📡 [AuthAPI] Registering user:', { email: userData.email });
    return api.post('/api/auth/register', userData);
  },
  login: (credentials) => {
    console.log('📡 [AuthAPI] Logging in:', { email: credentials.email });
    return api.post('/api/auth/login', credentials);
  },
  getMe: () => {
    console.log('📡 [AuthAPI] Getting current user');
    return api.get('/api/auth/me');
  },
  updateProfile: (userData) => {
    console.log('📡 [AuthAPI] Updating profile');
    return api.put('/api/auth/update-profile', userData);
  },
  logout: () => {
    console.log('📡 [AuthAPI] Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  verifyToken: (token) => {
    console.log('📡 [AuthAPI] Verifying token');
    return api.post('/api/auth/verify-token', { token });
  },
  forgotPassword: (email) => {
    console.log('📡 [AuthAPI] Forgot password:', { email });
    return api.post('/api/auth/forgot-password', { email });
  },
  resetPassword: (token, password) => {
    console.log('📡 [AuthAPI] Resetting password');
    return api.post('/api/auth/reset-password', { token, password });
  },
};

// ============ PRODUCT API ============
export const productAPI = {
  getProducts: (params = {}) => {
    console.log('📡 [ProductAPI] Getting products with params:', params);
    return api.get('/api/products', { params });
  },
  getProduct: (id) => {
    console.log('📡 [ProductAPI] Getting product by ID:', id);
    return api.get(`/api/products/${id}`);
  },
  getProductBySlug: (slug) => {
    console.log('📡 [ProductAPI] Getting product by slug:', slug);
    return api.get(`/api/products/slug/${slug}`);
  },
  createProduct: (productData) => {
    console.log('📡 [ProductAPI] Creating product:', { name: productData.name });
    return api.post('/api/products', productData);
  },
  updateProduct: (id, productData) => {
    console.log('📡 [ProductAPI] Updating product:', id);
    return api.put(`/api/products/${id}`, productData);
  },
  deleteProduct: (id) => {
    console.log('📡 [ProductAPI] Deleting product:', id);
    return api.delete(`/api/products/${id}`);
  },
  createReview: (id, reviewData) => {
    console.log('📡 [ProductAPI] Creating review for product:', id);
    return api.post(`/api/products/${id}/reviews`, reviewData);
  },
  getFeaturedProducts: () => {
    console.log('📡 [ProductAPI] Getting featured products');
    return api.get('/api/products/featured');
  },
  getBestSellers: () => {
    console.log('📡 [ProductAPI] Getting best sellers');
    return api.get('/api/products/best-sellers');
  },
  getNewArrivals: () => {
    console.log('📡 [ProductAPI] Getting new arrivals');
    return api.get('/api/products/new-arrivals');
  },
  getRelatedProducts: (id) => {
    console.log('📡 [ProductAPI] Getting related products for:', id);
    return api.get(`/api/products/${id}/related`);
  },
  searchProducts: (query) => {
    console.log('📡 [ProductAPI] Searching products:', query);
    return api.get('/api/products/search', { params: { q: query } });
  },
  getProductsByCategory: (categoryId) => {
    console.log('📡 [ProductAPI] Getting products by category:', categoryId);
    return api.get(`/api/products/category/${categoryId}`);
  },
  uploadProductImage: (formData) => {
    console.log('📡 [ProductAPI] Uploading product image');
    return api.post('/api/products/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// ============ CART API ============
export const cartAPI = {
  getCart: () => {
    console.log('📡 [CartAPI] Getting cart');
    return api.get('/api/cart');
  },
  addToCart: (productData) => {
    console.log('📡 [CartAPI] Adding to cart:', productData);
    return api.post('/api/cart', productData);
  },
  updateCartItem: (productId, data) => {
    console.log('📡 [CartAPI] Updating cart item:', { productId, data });
    return api.put(`/api/cart/${productId}`, data);
  },
  removeFromCart: (productId) => {
    console.log('📡 [CartAPI] Removing from cart:', productId);
    return api.delete(`/api/cart/${productId}`);
  },
  clearCart: () => {
    console.log('📡 [CartAPI] Clearing cart');
    return api.delete('/api/cart');
  },
  getCartCount: () => {
    console.log('📡 [CartAPI] Getting cart count');
    return api.get('/api/cart/count');
  },
  mergeCart: (cartItems) => {
    console.log('📡 [CartAPI] Merging cart');
    return api.post('/api/cart/merge', { items: cartItems });
  },
};

// ============ CATEGORY API ============
export const categoryAPI = {
  getCategories: () => {
    console.log('📡 [CategoryAPI] Getting all categories');
    return api.get('/api/categories');
  },
  getCategory: (id) => {
    console.log('📡 [CategoryAPI] Getting category by ID:', id);
    return api.get(`/api/categories/${id}`);
  },
  getCategoryBySlug: (slug) => {
    console.log('📡 [CategoryAPI] Getting category by slug:', slug);
    return api.get(`/api/categories/slug/${slug}`);
  },
  getFeaturedCategories: () => {
    console.log('📡 [CategoryAPI] Getting featured categories');
    return api.get('/api/categories/featured');
  },
  createCategory: (categoryData) => {
    console.log('📡 [CategoryAPI] Creating category:', { name: categoryData.name });
    return api.post('/api/categories', categoryData);
  },
  updateCategory: (id, categoryData) => {
    console.log('📡 [CategoryAPI] Updating category:', id);
    return api.put(`/api/categories/${id}`, categoryData);
  },
  deleteCategory: (id) => {
    console.log('📡 [CategoryAPI] Deleting category:', id);
    return api.delete(`/api/categories/${id}`);
  },
  getCategoryProducts: (id, params = {}) => {
    console.log('📡 [CategoryAPI] Getting products for category:', id);
    return api.get(`/api/categories/${id}/products`, { params });
  },
  getCategoryTree: () => {
    console.log('📡 [CategoryAPI] Getting category tree');
    return api.get('/api/categories/tree');
  },
};

// ============ ORDER API ============
export const orderAPI = {
  createOrder: (orderData) => {
    console.log('📡 [OrderAPI] Creating order');
    return api.post('/api/orders', orderData);
  },
  getOrder: (id) => {
    console.log('📡 [OrderAPI] Getting order:', id);
    return api.get(`/api/orders/${id}`);
  },
  getMyOrders: (params = {}) => {
    console.log('📡 [OrderAPI] Getting my orders');
    return api.get('/api/orders/myorders', { params });
  },
  getAllOrders: (params = {}) => {
    console.log('📡 [OrderAPI] Getting all orders');
    return api.get('/api/orders', { params });
  },
  updateToPaid: (id, paymentData) => {
    console.log('📡 [OrderAPI] Updating order to paid:', id);
    return api.put(`/api/orders/${id}/pay`, paymentData);
  },
  updateToDelivered: (id) => {
    console.log('📡 [OrderAPI] Updating order to delivered:', id);
    return api.put(`/api/orders/${id}/deliver`);
  },
  updateStatus: (id, statusData) => {
    console.log('📡 [OrderAPI] Updating order status:', { id, status: statusData.status });
    return api.put(`/api/orders/${id}/status`, statusData);
  },
  cancelOrder: (id) => {
    console.log('📡 [OrderAPI] Cancelling order:', id);
    return api.put(`/api/orders/${id}/cancel`);
  },
  getOrderInvoice: (id) => {
    console.log('📡 [OrderAPI] Getting order invoice:', id);
    return api.get(`/api/orders/${id}/invoice`, { responseType: 'blob' });
  },
  getOrderStats: () => {
    console.log('📡 [OrderAPI] Getting order stats');
    return api.get('/api/orders/stats');
  },
};

// ============ WISHLIST API ============
export const wishlistAPI = {
  getWishlist: () => {
    console.log('📡 [WishlistAPI] Getting wishlist');
    return api.get('/api/wishlist');
  },
  addToWishlist: (productId) => {
    console.log('📡 [WishlistAPI] Adding to wishlist:', productId);
    return api.post('/api/wishlist', { productId });
  },
  removeFromWishlist: (productId) => {
    console.log('📡 [WishlistAPI] Removing from wishlist:', productId);
    return api.delete(`/api/wishlist/${productId}`);
  },
  checkWishlist: (productId) => {
    console.log('📡 [WishlistAPI] Checking wishlist for:', productId);
    return api.get(`/api/wishlist/check/${productId}`);
  },
  moveToCart: (productId) => {
    console.log('📡 [WishlistAPI] Moving to cart:', productId);
    return api.post(`/api/wishlist/${productId}/move-to-cart`);
  },
};

// ============ REVIEW API ============
export const reviewAPI = {
  getProductReviews: (productId, params = {}) => {
    console.log('📡 [ReviewAPI] Getting reviews for product:', productId);
    return api.get(`/api/products/${productId}/reviews`, { params });
  },
  createReview: (productId, reviewData) => {
    console.log('📡 [ReviewAPI] Creating review for product:', productId);
    return api.post(`/api/products/${productId}/reviews`, reviewData);
  },
  updateReview: (productId, reviewId, reviewData) => {
    console.log('📡 [ReviewAPI] Updating review:', reviewId);
    return api.put(`/api/products/${productId}/reviews/${reviewId}`, reviewData);
  },
  deleteReview: (productId, reviewId) => {
    console.log('📡 [ReviewAPI] Deleting review:', reviewId);
    return api.delete(`/api/products/${productId}/reviews/${reviewId}`);
  },
  getMyReviews: () => {
    console.log('📡 [ReviewAPI] Getting my reviews');
    return api.get('/api/reviews/my-reviews');
  },
  getRecentReviews: (limit = 10) => {
    console.log('📡 [ReviewAPI] Getting recent reviews');
    return api.get('/api/reviews/recent', { params: { limit } });
  },
};

// ============ ADDRESS API ============
export const addressAPI = {
  getAddresses: () => {
    console.log('📡 [AddressAPI] Getting addresses');
    return api.get('/api/addresses');
  },
  getAddress: (id) => {
    console.log('📡 [AddressAPI] Getting address:', id);
    return api.get(`/api/addresses/${id}`);
  },
  createAddress: (addressData) => {
    console.log('📡 [AddressAPI] Creating address');
    return api.post('/api/addresses', addressData);
  },
  updateAddress: (id, addressData) => {
    console.log('📡 [AddressAPI] Updating address:', id);
    return api.put(`/api/addresses/${id}`, addressData);
  },
  deleteAddress: (id) => {
    console.log('📡 [AddressAPI] Deleting address:', id);
    return api.delete(`/api/addresses/${id}`);
  },
  setDefaultAddress: (id) => {
    console.log('📡 [AddressAPI] Setting default address:', id);
    return api.put(`/api/addresses/${id}/set-default`);
  },
};

// ============ UPLOAD API ============
export const uploadAPI = {
  uploadImage: (formData) => {
    console.log('📡 [UploadAPI] Uploading image');
    return api.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadMultiple: (formData) => {
    console.log('📡 [UploadAPI] Uploading multiple images');
    return api.post('/api/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteImage: (imageUrl) => {
    console.log('📡 [UploadAPI] Deleting image:', imageUrl);
    return api.delete('/api/upload', { data: { imageUrl } });
  },
};

// ============ PAYMENT API ============
export const paymentAPI = {
  createPaymentIntent: (orderData) => {
    console.log('📡 [PaymentAPI] Creating payment intent');
    return api.post('/api/payment/create-intent', orderData);
  },
  confirmPayment: (paymentData) => {
    console.log('📡 [PaymentAPI] Confirming payment');
    return api.post('/api/payment/confirm', paymentData);
  },
  getPaymentMethods: () => {
    console.log('📡 [PaymentAPI] Getting payment methods');
    return api.get('/api/payment/methods');
  },
  createStripeCustomer: (customerData) => {
    console.log('📡 [PaymentAPI] Creating Stripe customer');
    return api.post('/api/payment/create-customer', customerData);
  },
};

// ============ STATISTICS API ============
export const statsAPI = {
  getDashboardStats: () => {
    console.log('📡 [StatsAPI] Getting dashboard stats');
    return api.get('/api/stats/dashboard');
  },
  getSalesStats: (params = {}) => {
    console.log('📡 [StatsAPI] Getting sales stats');
    return api.get('/api/stats/sales', { params });
  },
  getProductStats: () => {
    console.log('📡 [StatsAPI] Getting product stats');
    return api.get('/api/stats/products');
  },
  getUserStats: () => {
    console.log('📡 [StatsAPI] Getting user stats');
    return api.get('/api/stats/users');
  },
};

// ============ TEST API ============
export const testAPI = {
  testConnection: () => {
    console.log('📡 [TestAPI] Testing connection to backend');
    return api.get('/health');
  },
  testEndpoint: () => {
    console.log('📡 [TestAPI] Testing API endpoint');
    return api.get('/api/test');
  },
  testAuth: () => {
    console.log('📡 [TestAPI] Testing auth endpoint');
    return api.get('/api/test-auth');
  },
  testDatabase: () => {
    console.log('📡 [TestAPI] Testing database connection');
    return api.get('/api/test-db');
  },
};

// ============ HEALTH CHECK ============
export const checkAPIHealth = async () => {
  try {
    console.log('🏥 [API] Checking API health...');
    const health = await testAPI.testConnection();
    console.log('✅ [API] Health check passed:', health);
    return { 
      healthy: true, 
      data: health,
      timestamp: new Date().toISOString(),
      baseURL: API_CONFIG.BASE_URL
    };
  } catch (error) {
    console.error('❌ [API] Health check failed:', error);
    return { 
      healthy: false, 
      error: error.message,
      suggestion: 'Make sure the backend server is running on ' + API_CONFIG.BASE_URL,
      timestamp: new Date().toISOString(),
      baseURL: API_CONFIG.BASE_URL
    };
  }
};

// ============ HELPER FUNCTIONS ============
export const apiHelpers = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },
  
  // Get current user info
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },
  
  // Set authentication data
  setAuthData: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  // Clear authentication data
  clearAuthData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Get auth headers
  getAuthHeaders: () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
  
  // Format error message
  formatErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.response?.data?.message) return error.response.data.message;
    return 'An unknown error occurred';
  },
  
  // Retry failed request
  retryRequest: async (requestFn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        console.log(`🔄 [API] Retrying request (attempt ${i + 2}/${maxRetries})`);
      }
    }
  },
};

// ============ ENDPOINT CONSTANTS ============
export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me',
    UPDATE_PROFILE: '/api/auth/update-profile',
    VERIFY_TOKEN: '/api/auth/verify-token',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    LOGOUT: '/api/auth/logout',
  },
  PRODUCTS: {
    GET_ALL: '/api/products',
    GET_ONE: '/api/products/:id',
    GET_BY_SLUG: '/api/products/slug/:slug',
    CREATE: '/api/products',
    UPDATE: '/api/products/:id',
    DELETE: '/api/products/:id',
    REVIEW: '/api/products/:id/reviews',
    FEATURED: '/api/products/featured',
    BEST_SELLERS: '/api/products/best-sellers',
    NEW_ARRIVALS: '/api/products/new-arrivals',
    RELATED: '/api/products/:id/related',
    SEARCH: '/api/products/search',
    BY_CATEGORY: '/api/products/category/:categoryId',
    UPLOAD_IMAGE: '/api/products/upload-image',
  },
  CART: {
    GET: '/api/cart',
    ADD: '/api/cart',
    UPDATE: '/api/cart/:productId',
    REMOVE: '/api/cart/:productId',
    CLEAR: '/api/cart',
    COUNT: '/api/cart/count',
    MERGE: '/api/cart/merge',
  },
  CATEGORIES: {
    GET_ALL: '/api/categories',
    GET_ONE: '/api/categories/:id',
    GET_BY_SLUG: '/api/categories/slug/:slug',
    FEATURED: '/api/categories/featured',
    CREATE: '/api/categories',
    UPDATE: '/api/categories/:id',
    DELETE: '/api/categories/:id',
    PRODUCTS: '/api/categories/:id/products',
    TREE: '/api/categories/tree',
  },
  ORDERS: {
    CREATE: '/api/orders',
    GET_ONE: '/api/orders/:id',
    MY_ORDERS: '/api/orders/myorders',
    GET_ALL: '/api/orders',
    PAY: '/api/orders/:id/pay',
    DELIVER: '/api/orders/:id/deliver',
    STATUS: '/api/orders/:id/status',
    CANCEL: '/api/orders/:id/cancel',
    INVOICE: '/api/orders/:id/invoice',
    STATS: '/api/orders/stats',
  },
  WISHLIST: {
    GET: '/api/wishlist',
    ADD: '/api/wishlist',
    REMOVE: '/api/wishlist/:productId',
    CHECK: '/api/wishlist/check/:productId',
    MOVE_TO_CART: '/api/wishlist/:productId/move-to-cart',
  },
  REVIEWS: {
    GET_PRODUCT_REVIEWS: '/api/products/:productId/reviews',
    CREATE: '/api/products/:productId/reviews',
    UPDATE: '/api/products/:productId/reviews/:reviewId',
    DELETE: '/api/products/:productId/reviews/:reviewId',
    MY_REVIEWS: '/api/reviews/my-reviews',
    RECENT: '/api/reviews/recent',
  },
  ADDRESSES: {
    GET_ALL: '/api/addresses',
    GET_ONE: '/api/addresses/:id',
    CREATE: '/api/addresses',
    UPDATE: '/api/addresses/:id',
    DELETE: '/api/addresses/:id',
    SET_DEFAULT: '/api/addresses/:id/set-default',
  },
  UPLOAD: {
    IMAGE: '/api/upload/image',
    MULTIPLE: '/api/upload/multiple',
    DELETE: '/api/upload',
  },
  PAYMENT: {
    CREATE_INTENT: '/api/payment/create-intent',
    CONFIRM: '/api/payment/confirm',
    METHODS: '/api/payment/methods',
    CREATE_CUSTOMER: '/api/payment/create-customer',
  },
  STATS: {
    DASHBOARD: '/api/stats/dashboard',
    SALES: '/api/stats/sales',
    PRODUCTS: '/api/stats/products',
    USERS: '/api/stats/users',
  },
  TEST: {
    CONNECTION: '/health',
    ENDPOINT: '/api/test',
    AUTH: '/api/test-auth',
    DATABASE: '/api/test-db',
  },
};

// ============ INITIALIZATION ============
// Initialize and test API connection on load
if (typeof window !== 'undefined') {
  // Log API configuration
  console.log('🌐 [API] Configuration:', {
    baseURL: API_CONFIG.BASE_URL,
    nodeEnv: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === 'production',
    hasToken: !!localStorage.getItem('token'),
    hasUser: !!localStorage.getItem('user'),
  });
  
  // Test connection after a short delay
  setTimeout(() => {
    console.log('🔌 [API] Testing initial connection...');
    checkAPIHealth().then(result => {
      if (!result.healthy) {
        console.warn('⚠️ [API] Backend might not be running or accessible');
        console.warn('💡 [API] Backend URL:', API_CONFIG.BASE_URL);
        console.warn('💡 [API] Check if backend server is running');
        
        // If in development, suggest local URL
        if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_API_URL) {
          console.warn('💡 [API] Try using local backend: http://localhost:5000');
          console.warn('💡 [API] Set REACT_APP_API_URL in .env file');
        }
      } else {
        console.log('🎉 [API] Backend is accessible and responsive');
      }
    });
  }, 1500);
}

// Export default api instance
export default api;