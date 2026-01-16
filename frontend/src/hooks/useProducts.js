import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productAPI.getProducts({
        page: pagination.page,
        limit: 10,
        ...params,
      });
      
      setProducts(response.products || response);
      
      if (response.total !== undefined) {
        setPagination({
          page: response.currentPage || 1,
          total: response.total,
          totalPages: response.totalPages || 1,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (id) => {
    try {
      setLoading(true);
      const product = await productAPI.getProduct(id);
      return product;
    } catch (err) {
      toast.error('Failed to fetch product details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (productId, reviewData) => {
    try {
      await productAPI.createReview(productId, reviewData);
      toast.success('Review submitted successfully');
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
      throw err;
    }
  };

  const changePage = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  useEffect(() => {
    fetchProducts(initialParams);
  }, [pagination.page]);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    getProduct,
    createReview,
    changePage,
  };
};