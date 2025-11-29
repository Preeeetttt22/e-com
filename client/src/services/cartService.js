import axiosInstance from '../utils/axiosInstance';

export const addToCart = async (productId, quantity = 1) => {
  const res = await axiosInstance.post("/api/cart/add", { productId, quantity });
  return res.data;
};

export const getCart = async () => {
  const res = await axiosInstance.get('/api/cart');
  return res.data;
};

export const updateCartItem = async (itemId, data) => {
  const res = await axiosInstance.put(`/api/cart/update/${itemId}`, data);
  return res.data;
};


export const removeFromCart = async (itemId) => {
  const res = await axiosInstance.delete(`/api/cart/remove/${itemId}`);
  return res.data;
};
