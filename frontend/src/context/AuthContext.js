import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await authAPI.getMe();
      setUser(userData.user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData.user));
    } catch (error) {
      console.error('Auth check failed:', error);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (parseError) {
          logout();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Registering:', userData.email);
      const response = await authAPI.register(userData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        _id: response._id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        role: response.role,
      }));
      
      setUser({
        _id: response._id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        role: response.role,
      });
      setIsAuthenticated(true);
      
      toast.success('Registration successful!');
      return response;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      console.log('🔐 Logging in:', credentials.email);
      const response = await authAPI.login(credentials);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        _id: response._id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        role: response.role,
        avatar: response.avatar,
      }));
      
      setUser({
        _id: response._id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        role: response.role,
        avatar: response.avatar,
      });
      setIsAuthenticated(true);
      
      toast.success('Login successful!');
      return response;
    } catch (error) {
      console.error('❌ Login failed:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const createTestUser = async () => {
    try {
      const response = await authAPI.createTestUser();
      toast.success('Test user created!');
      return response;
    } catch (error) {
      console.error('Test user creation failed:', error);
      toast.error(error.message || 'Test user creation failed');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    createTestUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};