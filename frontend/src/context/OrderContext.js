import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();
      setOrders(prev => [order, ...prev]);
      return order;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const ordersData = await response.json();
      setOrders(ordersData);
    } catch (error) {
      console.error('Fetch orders error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getOrderById = useCallback((orderId) => {
    return orders.find(order => order._id === orderId);
  }, [orders]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const updatedOrder = await response.json();
      setOrders(prev => prev.map(order => 
        order._id === orderId ? updatedOrder : order
      ));
      return updatedOrder;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  }, [token]);

  const cancelOrder = useCallback(async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      const updatedOrder = await response.json();
      setOrders(prev => prev.map(order => 
        order._id === orderId ? updatedOrder : order
      ));
      toast.success('Order cancelled successfully');
      return updatedOrder;
    } catch (error) {
      console.error('Cancel order error:', error);
      toast.error('Failed to cancel order');
      throw error;
    }
  }, [token]);

  const value = {
    orders,
    loading,
    createOrder,
    fetchOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};