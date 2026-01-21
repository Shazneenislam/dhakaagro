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

// Auth API
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
  }
};

// Product API
export const productAPI = {
  getProducts: (params = {}) => {
    console.log('📡 [ProductAPI] Get products');
    return api.get('/api/products', { params });
  },
  getProduct: (id) => api.get(`/api/products/${id}`),
  getFeaturedProducts: () => api.get('/api/products/featured'),
  getBestSellers: () => api.get('/api/products/best-sellers'),
  getNewArrivals: () => api.get('/api/products/new-arrivals'),
};

// Category API
export const categoryAPI = {
  getCategories: () => api.get('/api/categories'),
  getFeaturedCategories: () => api.get('/api/categories/featured'),
};

// Test API
export const testAPI = {
  testConnection: () => api.get('/health'),
  testEndpoint: () => api.get('/api/test'),
};

// Health check
export const checkAPIHealth = async () => {
  try {
    const health = await testAPI.testConnection();
    return { healthy: true, data: health };
  } catch (error) {
    return { 
      healthy: false, 
      error: error.message,
      suggestion: 'Make sure backend is running on ' + API_CONFIG.BASE_URL
    };
  }
};

// Initialize
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

export default api;