// src/services/adminService.js
import axiosInstance from '../utils/axiosInstance';

export const fetchDashboardSummary = async () => {
  const res = await axiosInstance.get('/api/admin/dashboard');
  return res.data;
};

export const fetchRevenueStats = async () => {
  const res = await axiosInstance.get('/api/admin/stats/revenue');
  return res.data;
};

export const fetchTopProducts = async () => {
  const res = await axiosInstance.get('/api/admin/stats/top-products');
  return res.data;
};

export const sendNewsletter = async ({ subject, message }) => {
  const res = await axiosInstance.post('/api/admin/newsletter', { subject, message });
  return res.data;
}; 

export const uploadNewsletterImage = async (formData) => {
  const res = await axiosInstance.post("/api/file/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const fetchAllOrders = async () => {
  const res = await axiosInstance.get('/api/admin/orders');
  return res.data;
};

export const updateOrderStatus = async (orderId, payload) => {
  const res = await axiosInstance.put(`/api/admin/orders/${orderId}/status`, payload);
  return res.data;
};
