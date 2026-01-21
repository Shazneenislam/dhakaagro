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
      // Try to get fresh user data
      const userData = await authAPI.getMe();
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Auth check failed, using stored user:', error);
      // Fall back to stored user data
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (parseError) {
          console.error('Failed to parse stored user:', parseError);
          logout();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 [AuthContext] Registering user:', { 
        email: userData.email, 
        name: userData.name 
      });
      
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
      
      console.log('✅ [AuthContext] Registration successful:', response.email);
      toast.success('Registration successful!');
      return response;
    } catch (error) {
      console.error('❌ [AuthContext] Registration failed:', error);
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      // Handle both parameter formats
      let credentials;
      if (typeof email === 'object' && email !== null) {
        credentials = email;
      } else if (typeof email === 'string' && typeof password === 'string') {
        credentials = { email, password };
      } else {
        throw new Error('Invalid login parameters');
      }

      console.log('🔐 [AuthContext] Logging in with:', { 
        email: credentials.email 
      });

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
      
      console.log('✅ [AuthContext] Login successful:', response.email);
      toast.success('Login successful!');
      return response;
    } catch (error) {
      console.error('❌ [AuthContext] Login failed:', error);
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

  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      setUser(response);
      localStorage.setItem('user', JSON.stringify(response));
      toast.success('Profile updated successfully');
      return response;
    } catch (error) {
      toast.error(error.message || 'Profile update failed');
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
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};