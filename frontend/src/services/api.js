import axios from 'axios';

// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://dhakaagro.onrender.com',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

console.log('🔧 [API] Initializing with:', {
  baseURL: API_CONFIG.BASE_URL,
  env: process.env.NODE_ENV
});

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🚀 [API] Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      hasData: !!config.data
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ [API] Response:', {
      status: response.status,
      url: response.config.url
    });
    return response.data;
  },
  (error) => {
    console.error('❌ [API] Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    return Promise.reject({
      message: error.response?.data?.message || error.message || 'Unknown error',
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// ============ AUTH API ============
export const authAPI = {
  register: (userData) => {
    console.log('📡 [AuthAPI] Register:', userData.email);
    return api.post('/api/auth/register', userData);
  },
  login: (credentials) => {
    console.log('📡 [AuthAPI] Login:', credentials.email);
    return api.post('/api/auth/login', credentials);
  },
  getMe: () => {
    console.log('📡 [AuthAPI] Get current user');
    return api.get('/api/auth/me');
  },
  createTestUser: () => {
    console.log('📡 [AuthAPI] Creating test user');
    return api.post('/api/auth/create-test');
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
  }
};

// ============ PRODUCT API ============
export const productAPI = {
  getProducts: (params = {}) => {
    console.log('📡 [ProductAPI] Get products');
    return api.get('/api/products', { params });
  },
  getProduct: (id) => {
    console.log('📡 [ProductAPI] Get product by ID:', id);
    return api.get(`/api/products/${id}`);
  },
  getProductBySlug: (slug) => {
    console.log('📡 [ProductAPI] Get product by slug:', slug);
    return api.get(`/api/products/slug/${slug}`);
  },
  createProduct: (productData) => {
    console.log('📡 [ProductAPI] Creating product');
    return api.post('/api/products', productData);
  },
  updateProduct: (id, productData) => {
    console.log('📡 [ProductAPI] Updating product');
    return api.put(`/api/products/${id}`, productData);
  },
  deleteProduct: (id) => {
    console.log('📡 [ProductAPI] Deleting product');
    return api.delete(`/api/products/${id}`);
  },
  createReview: (id, reviewData) => {
    console.log('📡 [ProductAPI] Creating review');
    return api.post(`/api/products/${id}/reviews`, reviewData);
  },
  getFeaturedProducts: () => {
    console.log('📡 [ProductAPI] Get featured products');
    return api.get('/api/products/featured');
  },
  getBestSellers: () => {
    console.log('📡 [ProductAPI] Get best sellers');
    return api.get('/api/products/best-sellers');
  },
  getNewArrivals: () => {
    console.log('📡 [ProductAPI] Get new arrivals');
    return api.get('/api/products/new-arrivals');
  },
  getRelatedProducts: (id) => {
    console.log('📡 [ProductAPI] Get related products');
    return api.get(`/api/products/${id}/related`);
  },
  searchProducts: (query) => {
    console.log('📡 [ProductAPI] Search products');
    return api.get('/api/products/search', { params: { q: query } });
  }
};

// ============ CART API ============
export const cartAPI = {
  getCart: () => {
    console.log('📡 [CartAPI] Getting cart');
    return api.get('/api/cart');
  },
  addToCart: (productData) => {
    console.log('📡 [CartAPI] Adding to cart');
    return api.post('/api/cart', productData);
  },
  updateCartItem: (productId, data) => {
    console.log('📡 [CartAPI] Updating cart item');
    return api.put(`/api/cart/${productId}`, data);
  },
  removeFromCart: (productId) => {
    console.log('📡 [CartAPI] Removing from cart');
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
  }
};

// ============ CATEGORY API ============
export const categoryAPI = {
  getCategories: () => {
    console.log('📡 [CategoryAPI] Getting categories');
    return api.get('/api/categories');
  },
  getCategory: (id) => {
    console.log('📡 [CategoryAPI] Getting category');
    return api.get(`/api/categories/${id}`);
  },
  getCategoryBySlug: (slug) => {
    console.log('📡 [CategoryAPI] Getting category by slug');
    return api.get(`/api/categories/slug/${slug}`);
  },
  getFeaturedCategories: () => {
    console.log('📡 [CategoryAPI] Getting featured categories');
    return api.get('/api/categories/featured');
  },
  createCategory: (categoryData) => {
    console.log('📡 [CategoryAPI] Creating category');
    return api.post('/api/categories', categoryData);
  },
  updateCategory: (id, categoryData) => {
    console.log('📡 [CategoryAPI] Updating category');
    return api.put(`/api/categories/${id}`, categoryData);
  },
  deleteCategory: (id) => {
    console.log('📡 [CategoryAPI] Deleting category');
    return api.delete(`/api/categories/${id}`);
  }
};

// ============ WISHLIST API ============
export const wishlistAPI = {
  getWishlist: () => {
    console.log('📡 [WishlistAPI] Getting wishlist');
    return api.get('/api/wishlist');
  },
  addToWishlist: (productId) => {
    console.log('📡 [WishlistAPI] Adding to wishlist');
    return api.post('/api/wishlist', { productId });
  },
  removeFromWishlist: (productId) => {
    console.log('📡 [WishlistAPI] Removing from wishlist');
    return api.delete(`/api/wishlist/${productId}`);
  },
  checkWishlist: (productId) => {
    console.log('📡 [WishlistAPI] Checking wishlist');
    return api.get(`/api/wishlist/check/${productId}`);
  },
  moveToCart: (productId) => {
    console.log('📡 [WishlistAPI] Moving to cart');
    return api.post(`/api/wishlist/${productId}/move-to-cart`);
  }
};

// ============ ORDER API ============
export const orderAPI = {
  createOrder: (orderData) => {
    console.log('📡 [OrderAPI] Creating order');
    return api.post('/api/orders', orderData);
  },
  getOrder: (id) => {
    console.log('📡 [OrderAPI] Getting order');
    return api.get(`/api/orders/${id}`);
  },
  getMyOrders: () => {
    console.log('📡 [OrderAPI] Getting my orders');
    return api.get('/api/orders/myorders');
  },
  getAllOrders: () => {
    console.log('📡 [OrderAPI] Getting all orders');
    return api.get('/api/orders');
  },
  updateToPaid: (id, paymentData) => {
    console.log('📡 [OrderAPI] Updating to paid');
    return api.put(`/api/orders/${id}/pay`, paymentData);
  },
  updateToDelivered: (id) => {
    console.log('📡 [OrderAPI] Updating to delivered');
    return api.put(`/api/orders/${id}/deliver`);
  }
};

// ============ TEST API ============
export const testAPI = {
  testConnection: () => {
    console.log('📡 [TestAPI] Testing connection');
    return api.get('/health');
  },
  testEndpoint: () => {
    console.log('📡 [TestAPI] Testing endpoint');
    return api.get('/api/test');
  }
};

// ============ HEALTH CHECK ============
export const checkAPIHealth = async () => {
  try {
    console.log('🏥 [API] Checking health...');
    const health = await testAPI.testConnection();
    console.log('✅ [API] Health check passed');
    return { healthy: true, data: health };
  } catch (error) {
    console.error('❌ [API] Health check failed:', error);
    return { 
      healthy: false, 
      error: error.message,
      suggestion: 'Check backend at ' + API_CONFIG.BASE_URL
    };
  }
};

// ============ HELPER FUNCTIONS ============
export const apiHelpers = {
  isAuthenticated: () => {
    return !!(localStorage.getItem('token') && localStorage.getItem('user'));
  },
  
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  },
  
  setAuthData: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  clearAuthData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getAuthHeaders: () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
  
  formatErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.response?.data?.message) return error.response.data.message;
    return 'An unknown error occurred';
  }
};

// ============ ENDPOINT CONSTANTS ============
export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me',
    UPDATE_PROFILE: '/api/auth/update-profile',
    CREATE_TEST: '/api/auth/create-test'
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
    SEARCH: '/api/products/search'
  },
  CART: {
    GET: '/api/cart',
    ADD: '/api/cart',
    UPDATE: '/api/cart/:productId',
    REMOVE: '/api/cart/:productId',
    CLEAR: '/api/cart',
    COUNT: '/api/cart/count',
    MERGE: '/api/cart/merge'
  },
  CATEGORIES: {
    GET_ALL: '/api/categories',
    GET_ONE: '/api/categories/:id',
    GET_BY_SLUG: '/api/categories/slug/:slug',
    FEATURED: '/api/categories/featured',
    CREATE: '/api/categories',
    UPDATE: '/api/categories/:id',
    DELETE: '/api/categories/:id'
  },
  WISHLIST: {
    GET: '/api/wishlist',
    ADD: '/api/wishlist',
    REMOVE: '/api/wishlist/:productId',
    CHECK: '/api/wishlist/check/:productId',
    MOVE_TO_CART: '/api/wishlist/:productId/move-to-cart'
  },
  ORDERS: {
    CREATE: '/api/orders',
    GET_ONE: '/api/orders/:id',
    MY_ORDERS: '/api/orders/myorders',
    GET_ALL: '/api/orders',
    PAY: '/api/orders/:id/pay',
    DELIVER: '/api/orders/:id/deliver'
  }
};

// Initialize health check
if (typeof window !== 'undefined') {
  setTimeout(() => {
    checkAPIHealth().then(result => {
      if (!result.healthy) {
        console.warn('⚠️ Backend might not be accessible');
      } else {
        console.log('🎉 Backend is responsive');
      }
    });
  }, 1500);
}

// Export default
export default api;