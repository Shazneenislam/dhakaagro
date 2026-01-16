import axios from 'axios';
import { API_CONFIG } from './apiConfig';

console.log('🔧 [API] Initializing with config:', {
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT
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
      params: config.params,
      data: config.data,
      headers: config.headers
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
      isArray: Array.isArray(response.data),
      dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
      dataKeys: !Array.isArray(response.data) && response.data ? Object.keys(response.data) : 'N/A',
      timestamp: new Date().toISOString()
    });
    
    return response.data;
  },
  (error) => {
    console.error('❌ [API] Response error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      headers: error.response?.headers,
      fullError: error
    });
    
    const { response } = error;
    
    if (response?.status === 401) {
      console.warn('🔒 [API] Unauthorized access, clearing token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect automatically to avoid breaking the UI
      // window.location.href = '/login';
    }
    
    // Return a consistent error format
    const errorData = {
      message: response?.data?.message || error.message || 'Unknown error',
      status: response?.status,
      data: response?.data
    };
    
    return Promise.reject(errorData);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => {
    console.log('📡 [AuthAPI] Registering user:', { email: userData.email });
    return api.post('/auth/register', userData);
  },
  login: (credentials) => {
    console.log('📡 [AuthAPI] Logging in:', { email: credentials.email });
    return api.post('/auth/login', credentials);
  },
  getMe: () => {
    console.log('📡 [AuthAPI] Getting current user');
    return api.get('/auth/me');
  },
  updateProfile: (userData) => {
    console.log('📡 [AuthAPI] Updating profile');
    return api.put('/auth/update-profile', userData);
  },
};

// Product API
export const productAPI = {
  getProducts: (params = {}) => {
    console.log('📡 [ProductAPI] Getting products with params:', {
      ...params,
      hasSearch: !!params.search,
      hasCategory: !!params.category,
      hasSortBy: !!params.sortBy,
      page: params.page || 1,
      limit: params.limit || 10
    });
    return api.get('/products', { params });
  },
  getProduct: (id) => {
    console.log('📡 [ProductAPI] Getting product by ID:', id);
    return api.get(`/products/${id}`);
  },
  getProductBySlug: (slug) => {
    console.log('📡 [ProductAPI] Getting product by slug:', slug);
    return api.get(`/products/slug/${slug}`);
  },
  createProduct: (productData) => {
    console.log('📡 [ProductAPI] Creating product:', { name: productData.name });
    return api.post('/products', productData);
  },
  updateProduct: (id, productData) => {
    console.log('📡 [ProductAPI] Updating product:', id);
    return api.put(`/products/${id}`, productData);
  },
  deleteProduct: (id) => {
    console.log('📡 [ProductAPI] Deleting product:', id);
    return api.delete(`/products/${id}`);
  },
  createReview: (id, reviewData) => {
    console.log('📡 [ProductAPI] Creating review for product:', id);
    return api.post(`/products/${id}/reviews`, reviewData);
  },
  getFeaturedProducts: () => {
    console.log('📡 [ProductAPI] Getting featured products');
    return api.get('/products/featured');
  },
  getBestSellers: () => {
    console.log('📡 [ProductAPI] Getting best sellers');
    return api.get('/products/best-sellers');
  },
  getNewArrivals: () => {
    console.log('📡 [ProductAPI] Getting new arrivals');
    return api.get('/products/new-arrivals');
  },
  getRelatedProducts: (id) => {
    console.log('📡 [ProductAPI] Getting related products for:', id);
    return api.get(`/products/${id}/related`);
  },
};

// Cart API
export const cartAPI = {
  getCart: () => {
    console.log('📡 [CartAPI] Getting cart');
    return api.get('/cart');
  },
  addToCart: (productData) => {
    console.log('📡 [CartAPI] Adding to cart:', productData);
    return api.post('/cart', productData);
  },
  updateCartItem: (productId, data) => {
    console.log('📡 [CartAPI] Updating cart item:', { productId, data });
    return api.put(`/cart/${productId}`, data);
  },
  removeFromCart: (productId) => {
    console.log('📡 [CartAPI] Removing from cart:', productId);
    return api.delete(`/cart/${productId}`);
  },
  clearCart: () => {
    console.log('📡 [CartAPI] Clearing cart');
    return api.delete('/cart');
  },
};

// Category API
export const categoryAPI = {
  getCategories: () => {
    console.log('📡 [CategoryAPI] Getting all categories');
    return api.get('/categories');
  },
  getCategory: (id) => {
    console.log('📡 [CategoryAPI] Getting category by ID:', id);
    return api.get(`/categories/${id}`);
  },
  getCategoryBySlug: (slug) => {
    console.log('📡 [CategoryAPI] Getting category by slug:', slug);
    return api.get(`/categories/slug/${slug}`);
  },
  getFeaturedCategories: () => {
    console.log('📡 [CategoryAPI] Getting featured categories');
    return api.get('/categories/featured');
  },
  createCategory: (categoryData) => {
    console.log('📡 [CategoryAPI] Creating category:', { name: categoryData.name });
    return api.post('/categories', categoryData);
  },
  updateCategory: (id, categoryData) => {
    console.log('📡 [CategoryAPI] Updating category:', id);
    return api.put(`/categories/${id}`, categoryData);
  },
  deleteCategory: (id) => {
    console.log('📡 [CategoryAPI] Deleting category:', id);
    return api.delete(`/categories/${id}`);
  },
};

// Order API
export const orderAPI = {
  createOrder: (orderData) => {
    console.log('📡 [OrderAPI] Creating order');
    return api.post('/orders', orderData);
  },
  getOrder: (id) => {
    console.log('📡 [OrderAPI] Getting order:', id);
    return api.get(`/orders/${id}`);
  },
  getMyOrders: () => {
    console.log('📡 [OrderAPI] Getting my orders');
    return api.get('/orders/myorders');
  },
  getAllOrders: () => {
    console.log('📡 [OrderAPI] Getting all orders');
    return api.get('/orders');
  },
  updateToPaid: (id, paymentData) => {
    console.log('📡 [OrderAPI] Updating order to paid:', id);
    return api.put(`/orders/${id}/pay`, paymentData);
  },
  updateToDelivered: (id) => {
    console.log('📡 [OrderAPI] Updating order to delivered:', id);
    return api.put(`/orders/${id}/deliver`);
  },
  updateStatus: (id, statusData) => {
    console.log('📡 [OrderAPI] Updating order status:', { id, status: statusData.status });
    return api.put(`/orders/${id}/status`, statusData);
  },
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => {
    console.log('📡 [WishlistAPI] Getting wishlist');
    return api.get('/wishlist');
  },
  addToWishlist: (productId) => {
    console.log('📡 [WishlistAPI] Adding to wishlist:', productId);
    return api.post('/wishlist', { productId });
  },
  removeFromWishlist: (productId) => {
    console.log('📡 [WishlistAPI] Removing from wishlist:', productId);
    return api.delete(`/wishlist/${productId}`);
  },
  checkWishlist: (productId) => {
    console.log('📡 [WishlistAPI] Checking wishlist for:', productId);
    return api.get(`/wishlist/check/${productId}`);
  },
};

// Test API connection
export const testAPI = {
  testConnection: () => {
    console.log('📡 [TestAPI] Testing connection to backend');
    return api.get('/health');
  },
  testEndpoint: () => {
    console.log('📡 [TestAPI] Testing API endpoint');
    return api.get('/api/test');
  },
};

// Health check utility
export const checkAPIHealth = async () => {
  try {
    console.log('🏥 [API] Checking API health...');
    const health = await testAPI.testConnection();
    console.log('✅ [API] Health check passed:', health);
    return { healthy: true, data: health };
  } catch (error) {
    console.error('❌ [API] Health check failed:', error);
    return { 
      healthy: false, 
      error: error.message,
      suggestion: 'Make sure the backend server is running on ' + API_CONFIG.BASE_URL
    };
  }
};

// Initialize and test API connection on load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    console.log('🔌 [API] Testing initial connection...');
    checkAPIHealth().then(result => {
      if (!result.healthy) {
        console.warn('⚠️ [API] Backend might not be running or accessible');
        console.warn('💡 [API] Try running: cd backend && npm run dev');
      }
    });
  }, 1000);
}

export default api;