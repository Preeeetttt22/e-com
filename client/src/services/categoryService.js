import axiosInstance from '../utils/axiosInstance';

export const getAllCategories = async () => {
  const res = await axiosInstance.get('/api/admin/categories/all');
  return res.data;
};

export const addCategory = async (payload) => {
  const res = await axiosInstance.post('/api/admin/categories', payload);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await axiosInstance.delete(`/api/admin/categories/${id}`);
  return res.data;
};

export const updateCategory = async (id, payload) => {
  const res = await axiosInstance.put(`/api/admin/categories/${id}`, payload);
  return res.data;
};

export const toggleCategoryStatus = async (id) => {
  const res = await axiosInstance.put(`/api/admin/categories/${id}/toggle`);
  return res.data;
};

export const getCategories = async () => {
  const res = await axiosInstance.get('/api/categories');
  return res.data;
};