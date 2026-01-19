export const API_CONFIG = {
  // Use the correct base URL
  BASE_URL: process.env.REACT_APP_API_URL || 'https://dhakaagro.onrender.com',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Log the config to see what's being used
console.log('🔧 [API Config] Base URL:', API_CONFIG.BASE_URL);
console.log('🔧 [API Config] Environment variable:', process.env.REACT_APP_API_URL);
console.log('🔧 [API Config] Node environment:', process.env.NODE_ENV);

export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/update-profile',
  },
  PRODUCTS: {
    GET_ALL: '/products',
    GET_ONE: '/products/:id',
    GET_BY_SLUG: '/products/slug/:slug',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
    REVIEW: '/products/:id/reviews',
    FEATURED: '/products/featured',
    BEST_SELLERS: '/products/best-sellers',
    NEW_ARRIVALS: '/products/new-arrivals',
    RELATED: '/products/:id/related',
  },
  CART: {
    GET: '/cart',
    ADD: '/cart',
    UPDATE: '/cart/:productId',
    REMOVE: '/cart/:productId',
    CLEAR: '/cart',
  },
  CATEGORIES: {
    GET_ALL: '/categories',
    GET_ONE: '/categories/:id',
    GET_BY_SLUG: '/categories/slug/:slug',
    FEATURED: '/categories/featured',
    CREATE: '/categories',
    UPDATE: '/categories/:id',
    DELETE: '/categories/:id',
  },
  ORDERS: {
    CREATE: '/orders',
    GET_ONE: '/orders/:id',
    MY_ORDERS: '/orders/myorders',
    GET_ALL: '/orders',
    PAY: '/orders/:id/pay',
    DELIVER: '/orders/:id/deliver',
    STATUS: '/orders/:id/status',
  },
  WISHLIST: {
    GET: '/wishlist',
    ADD: '/wishlist',
    REMOVE: '/wishlist/:productId',
    CHECK: '/wishlist/check/:productId',
  },
};