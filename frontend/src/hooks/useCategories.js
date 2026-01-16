import { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedCategories = async () => {
    try {
      const data = await categoryAPI.getFeaturedCategories();
      setFeaturedCategories(data);
    } catch (error) {
      console.error('Error fetching featured categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchFeaturedCategories();
  }, []);

  return {
    categories,
    featuredCategories,
    loading,
    fetchCategories,
  };
};